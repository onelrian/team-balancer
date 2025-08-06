import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { query } from './db';

interface SessionUser {
  id: number;
  discordId: string;
  username: string;
  role: 'admin' | 'user';
}

interface DiscordProfile {
  id: string;
  username: string;
  avatar: string;
  image: string;
}

// Define the scopes we need from Discord
const scopes = ['identify', 'email', 'guilds'].join(' ');

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: scopes } },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      // Type assertion to access Discord profile properties
      const discordProfile = profile as DiscordProfile;
      
      if (!user.id || !discordProfile?.username) {
        return false;
      }

      try {
        // Check if user exists in our database
        const result = await query(
          'SELECT id, role FROM users WHERE discord_id = $1',
          [user.id]
        );

        if (result.rows.length > 0) {
          // User exists, update their information
          await query(
            'UPDATE users SET username = $1, avatar = $2, updated_at = NOW() WHERE discord_id = $3',
            [discordProfile.username, discordProfile.image, user.id]
          );
        } else {
          // New user, check if default admin exists
          const adminCheck = await query(
            'SELECT id FROM users WHERE discord_id = $1',
            ['default_admin']
          );

          if (adminCheck.rows.length > 0) {
            // Default admin exists, update it with first real user's information
            await query(
              'UPDATE users SET discord_id = $1, username = $2, avatar = $3, role = $4, updated_at = NOW() WHERE discord_id = $5',
              [user.id, discordProfile.username, discordProfile.image, 'admin', 'default_admin']
            );
          } else {
            // No default admin exists, insert new user with 'user' role
            await query(
              'INSERT INTO users (discord_id, username, avatar, role) VALUES ($1, $2, $3, $4)',
              [user.id, discordProfile.username, discordProfile.image, 'user']
            );
          }
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // Get user details from database
      const result = await query(
        'SELECT id, discord_id, username, role FROM users WHERE discord_id = $1',
        [token.sub]
      );

      if (result.rows.length > 0) {
        const sessionUser = session.user as SessionUser;
        sessionUser.id = result.rows[0].id;
        sessionUser.discordId = result.rows[0].discord_id;
        sessionUser.username = result.rows[0].username;
        sessionUser.role = result.rows[0].role;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);