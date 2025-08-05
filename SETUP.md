# TeamBalancer Setup Guide

This guide will walk you through setting up the TeamBalancer system for local development and testing.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18 or higher
- npm (comes with Node.js)
- Docker and Docker Compose
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/team-balancer.git
cd team-balancer
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Configuration

Create a `.env` file in the root directory based on the `.env.example` file:

```bash
cp .env.example .env
```

You'll need to configure the following environment variables:

### Discord OAuth Configuration
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "OAuth2" section
4. Add a redirect URL: `http://localhost:3000/api/auth/callback`
5. Note your Client ID and Client Secret
6. Update your `.env` file:
   ```
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

### Database Configuration
The database is configured to run in Docker by default. The connection string is already set in the `.env.example` file:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/team_balancer
```

### NextAuth Configuration
Generate a secret for NextAuth:
```bash
openssl rand -base64 32
```
Then update your `.env` file:
```
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

### Groq API Configuration
1. Go to [Groq Cloud](https://console.groq.com/)
2. Sign up for an account
3. Create an API key
4. Update your `.env` file:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

### Discord Webhook Configuration (Optional for Testing)
1. Create a Discord server for testing
2. Create a webhook in a channel
3. Update your `.env` file:
   ```
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   ```

## 4. Database Setup

Start the PostgreSQL database using Docker:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This will:
- Start a PostgreSQL container
- Create a database named `team_balancer`
- Initialize the database schema using `docker/init.sql`

## 5. Run Database Migrations (if needed)

If you need to manually run the database schema:

```bash
# Connect to the database
docker exec -it team-balancer-db psql -U postgres -d team_balancer

# Then run the init.sql script or copy and paste its contents
```

## 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 7. Initial Setup

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Sign in with Discord"
3. The first user to sign in will automatically become an admin
4. After signing in, you'll be redirected to the dashboard

## 8. Testing the System

### As an Administrator:
1. Navigate to the Admin Dashboard at `http://localhost:3000/admin`
2. Create work portions with different weights
3. Manage user roles
4. Generate new assignments manually

### As a Team Member:
1. Sign in with Discord
2. View current assignments on the dashboard
3. Set preferences for work portions

### Testing Work Distribution:
1. Create several work portions as an admin
2. Have multiple users sign in and set preferences
3. Generate assignments via the admin dashboard
4. Check that assignments are distributed fairly based on weights and preferences

## 9. Running Tests

To run the test suite:

```bash
npm test
```

## 10. Stopping the Application

To stop the development server:
- Press `Ctrl+C` in the terminal where it's running

To stop the database:
```bash
docker-compose -f docker/docker-compose.yml down
```

## Troubleshooting

### Database Connection Issues
- Ensure Docker is running
- Check that the database container is up: `docker ps`
- Verify the connection string in your `.env` file

### Discord OAuth Issues
- Ensure your redirect URL is correctly configured in the Discord Developer Portal
- Check that your Client ID and Secret are correct

### Groq API Issues
- Verify your API key is correct
- Check that you have credits available in your Groq account

### Port Conflicts
- If port 3000 is in use, you can change it by setting the `PORT` environment variable
- If port 5432 is in use, modify the `docker-compose.yml` file to use a different port

## Next Steps

Once you've verified the system works locally, you can:
1. Deploy to Vercel for production
2. Set up the GitHub Actions workflow for automated distribution
3. Configure Discord notifications for your team