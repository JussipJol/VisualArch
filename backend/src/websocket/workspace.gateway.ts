import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'visualarch_jwt_secret_dev_2025';

interface UserPresence {
  userId: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number; nodeId?: string };
  selectedNode?: string;
  isEditing?: string;
}

// Active workspace sessions: workspaceId -> { socketId -> UserPresence }
const workspaceSessions = new Map<string, Map<string, UserPresence>>();

const CURSOR_COLORS = ['#5E81F4', '#22D3EE', '#4ADE80', '#FACC15', '#F87171', '#A78BFA'];

function getColorForUser(index: number): string {
  return CURSOR_COLORS[index % CURSOR_COLORS.length];
}

export function initializeWebSocket(httpServer: HTTPServer, frontendUrl: string): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: frontendUrl || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Auth middleware for Socket.io
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token ?? socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      (socket as Socket & { user?: JWTPayload }).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  const workspaceNamespace = io.of('/workspace');

  workspaceNamespace.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      (socket as Socket & { user?: JWTPayload }).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  workspaceNamespace.on('connection', (socket: Socket) => {
    const user = (socket as Socket & { user?: JWTPayload }).user;
    if (!user) { socket.disconnect(); return; }

    let currentWorkspaceId: string | null = null;

    console.log(`[WS] User ${user.userId} connected`);

    // JOIN WORKSPACE
    socket.on('join_workspace', ({ workspaceId }: { workspaceId: string }) => {
      currentWorkspaceId = workspaceId;
      socket.join(workspaceId);

      if (!workspaceSessions.has(workspaceId)) {
        workspaceSessions.set(workspaceId, new Map());
      }

      const session = workspaceSessions.get(workspaceId)!;
      const colorIndex = session.size;

      const presence: UserPresence = {
        userId: user.userId,
        name: user.email.split('@')[0],
        color: getColorForUser(colorIndex),
      };

      session.set(socket.id, presence);

      // Send current participants to newcomer
      socket.emit('room_state', {
        participants: Array.from(session.values()),
      });

      // Broadcast join to others
      socket.to(workspaceId).emit('user_joined', presence);

      console.log(`[WS] User ${user.userId} joined workspace ${workspaceId}`);
    });

    // CURSOR MOVEMENT (Throttled update)
    socket.on('cursor_move', ({ x, y, nodeId }: { x: number; y: number; nodeId?: string }) => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (!session) return;

      const presence = session.get(socket.id);
      if (presence) {
        presence.cursor = { x, y, nodeId };
      }
    });

    // START BATCHED BROADCAST FOR CURSORS
    const broadcastInterval = setInterval(() => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (!session || session.size === 0) return;

      const cursors = Object.fromEntries(
        Array.from(session.entries())
          .filter(([, p]) => p.cursor)
          .map(([, p]) => [p.userId, p.cursor])
      );

      workspaceNamespace.to(currentWorkspaceId).emit('cursors_update', { cursors });
    }, 50); // 20Hz update rate is plenty for smooth cursors while saving 80% bandwidth

    // NODE SELECTED
    socket.on('node_selected', ({ nodeId }: { nodeId: string }) => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (session?.get(socket.id)) {
        session.get(socket.id)!.selectedNode = nodeId;
        socket.to(currentWorkspaceId).emit('node_selection_changed', {
          userId: user.userId,
          nodeId,
        });
      }
    });

    // NODE EDITING (lock indicator)
    socket.on('node_editing', ({ nodeId, isEditing }: { nodeId: string; isEditing: boolean }) => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (session?.get(socket.id)) {
        session.get(socket.id)!.isEditing = isEditing ? nodeId : undefined;
      }
      socket.to(currentWorkspaceId).emit('node_lock_changed', {
        userId: user.userId,
        nodeId,
        isLocked: isEditing,
      });
    });

    // GENERATION STARTED
    socket.on('generation_started', ({ prompt }: { prompt: string }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('generation_started', {
        by: user.userId,
        prompt: prompt.substring(0, 100),
      });
    });

    // GENERATION COMPLETE
    socket.on('generation_complete', ({ architectureData }: { architectureData: unknown }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('generation_complete', { architectureData });
    });

    // COMMENT ADDED
    socket.on('comment_added', ({ comment }: { comment: unknown }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('comment_added', { comment });
    });

    // ADR CREATED
    socket.on('adr_created', ({ adr }: { adr: unknown }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('adr_created', { adr });
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      clearInterval(broadcastInterval);
      if (currentWorkspaceId) {
        const session = workspaceSessions.get(currentWorkspaceId);
        if (session) {
          const presence = session.get(socket.id);
          session.delete(socket.id);

          if (presence) {
            socket.to(currentWorkspaceId).emit('user_left', { userId: presence.userId });
          }

          if (session.size === 0) {
            workspaceSessions.delete(currentWorkspaceId);
          }
        }
      }
      console.log(`[WS] User ${user.userId} disconnected`);
    });
  });

  // Health check namespace
  io.on('connection', (socket) => {
    socket.on('ping', () => socket.emit('pong', { timestamp: Date.now() }));
  });

  return io;
}
