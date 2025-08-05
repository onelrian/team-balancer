import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { query } from './db';

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
    async signIn({ user, account, profile }) {
      if (!user.id || !profile?.username) {
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
            [profile.username, profile.image, user.id]
          );
        } else {
          // New user, insert into database
          // Check if this is the first user (default admin)
          const adminCheck = await query(
            'SELECT id FROM users WHERE discord_id = $1',
            ['default_admin']
          );

          const role = adminCheck.rows.length > 0 ? 'user' : 'admin';
          
          await query(
            'INSERT INTO users (discord_id, username, avatar, role) VALUES ($1, $2, $3, $4)',
            [user.id, profile.username, profile.image, role]
          );

          // If this was the first user, remove the default admin
          if (role === 'admin') {
            await query(
              'DELETE FROM users WHERE discord_id = $1',
              ['default_admin']
            );
          }
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session, user, token }) {
      // Get user details from database
      const result = await query(
        'SELECT id, discord_id, username, role FROM users WHERE discord_id = $1',
        [token.sub]
      );

      if (result.rows.length > 0) {
        session.user = {
          ...session.user,
          id: result.rows[0].id,
          discordId: result.rows[0].discord_id,
          username: result.rows[0].username,
          role: result.rows[0].role,
        };
      }

      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);