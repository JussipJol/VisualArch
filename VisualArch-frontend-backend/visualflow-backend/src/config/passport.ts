import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { User } from '../models/User.model';
import { config } from './env';

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: `${config.backendUrl}/api/auth/github/callback`,
}, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      // Check if user exists with the same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          user.githubId = profile.id;
          await user.save();
        }
      }
      
      if (!user) {
        user = await User.create({
          email: email || `${profile.username}@github.com`,
          name: profile.displayName || profile.username || 'GitHub User',
          githubId: profile.id,
          plan: 'free',
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: `${config.backendUrl}/api/auth/google/callback`,
}, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        }
      }

      if (!user) {
        user = await User.create({
          email: email || `${profile.id}@google.com`,
          name: profile.displayName || 'Google User',
          googleId: profile.id,
          plan: 'free',
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Discord Strategy
passport.use(new DiscordStrategy({
  clientID: config.discord.clientId,
  clientSecret: config.discord.clientSecret,
  callbackURL: `${config.backendUrl}/api/auth/discord/callback`,
  scope: ['identify', 'email'],
}, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
  try {
    let user = await User.findOne({ discordId: profile.id });
    if (!user) {
      const email = profile.email;
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          user.discordId = profile.id;
          await user.save();
        }
      }

      if (!user) {
        user = await User.create({
          email: email || `${profile.id}@discord.com`,
          name: profile.username || 'Discord User',
          discordId: profile.id,
          plan: 'free',
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
