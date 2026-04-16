// Локальное хранилище проектов — используется когда бэкенд недоступен

export interface LocalProject {
  _id: string;
  name: string;
  description: string;
  currentStage: string;
  updatedAt: string;
  createdAt: string;
  isLocal: true; // маркер, что проект локальный
}

const KEY = 'local_projects';

const load = (): LocalProject[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

const save = (projects: LocalProject[]) => {
  localStorage.setItem(KEY, JSON.stringify(projects));
};

export const localProjects = {
  getAll: (): LocalProject[] => load(),

  getById: (id: string): LocalProject | undefined =>
    load().find(p => p._id === id),

  create: (name: string, description: string): LocalProject => {
    const project: LocalProject = {
      _id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      description,
      currentStage: 'canvas',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isLocal: true,
    };
    const all = load();
    all.unshift(project);
    save(all);
    return project;
  },

  delete: (id: string) => {
    save(load().filter(p => p._id !== id));
  },

  update: (id: string, patch: Partial<LocalProject>) => {
    const all = load().map(p =>
      p._id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
    );
    save(all);
  },

  isLocalId: (id: string) => id.startsWith('local_'),
};
