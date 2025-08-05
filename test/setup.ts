// Setup file for Jest tests
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/team_balancer_test';
process.env.DISCORD_CLIENT_ID = 'test-discord-client-id';
process.env.DISCORD_CLIENT_SECRET = 'test-discord-client-secret';
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret';
process.env.GROQ_API_KEY = 'test-groq-api-key';