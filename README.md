# TeamBalancer

An intelligent workload distribution system with Discord integration and role-based access control.

## Overview

TeamBalancer is an automated workload distribution platform that intelligently assigns tasks to team members with full Discord integration and role-based access control. The system ensures fair work rotation while maintaining transparency through a shared dashboard.

## Features

- **Role-based Access Control**: Two roles (Admin and Normal User) with appropriate permissions
- **Discord OAuth Integration**: Seamless authentication using Discord accounts
- **AI-powered Work Distribution**: Uses Groq API to optimize workload assignments
- **Automated Cycles**: Generates new assignments every 14 days automatically
- **Work Portion Management**: Admins can create work portions with weight assignments
- **User Preferences**: Users can set preferences for work portions
- **Discord Notifications**: Automatic notifications for system events
- **Transparent Dashboard**: Single shared link for the entire team to view assignments

## Technical Architecture

### Frontend
- Next.js 14 with TypeScript
- TailwindCSS for styling
- Responsive design for all devices

### Backend
- Next.js API Routes
- PostgreSQL database with Docker containerization
- Discord OAuth 2.0 authentication
- Groq API for AI-powered distribution

### Automation
- GitHub Actions for scheduled distribution
- Vercel for deployment
- Discord webhooks for notifications

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL
- Discord Developer Account
- Groq API Key
- Vercel Account

### Environment Variables
Create a `.env` file based on `.env.example`:

```env
# Discord OAuth Configuration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
DISCORD_BOT_TOKEN=your_discord_bot_token

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/team_balancer

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# Discord Webhook URL
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Vercel Deployment URL (for production)
VERCEL_URL=your_vercel_url
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/team-balancer.git
   cd team-balancer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment

1. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

2. Set up GitHub Actions:
   - Add the required secrets to your GitHub repository
   - The workflow will automatically run every 14 days

## Usage

### For Administrators
1. Sign in with Discord (first user becomes admin)
2. Create work portions with appropriate weights
3. Manage user roles and permissions
4. Generate new assignments manually or wait for automatic cycles
5. View analytics and assignment history

### For Team Members
1. Sign in with Discord
2. View current assignments on the dashboard
3. Set preferences for work portions
4. Receive Discord notifications for new assignments

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/callback` - OAuth callback

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `PUT /api/users/[id]/role` - Update user role

### Work Management
- `GET /api/work-portions` - Get all work portions
- `POST /api/work-portions` - Create a work portion (Admin)
- `PUT /api/work-portions/[id]` - Update a work portion (Admin)
- `DELETE /api/work-portions/[id]` - Delete a work portion (Admin)

### Workload Preferences
- `GET /api/workload-preferences` - Get user's preferences
- `POST /api/workload-preferences` - Set a preference

### Assignments
- `GET /api/assignments/current` - Get current assignments
- `POST /api/assignments/generate` - Generate new assignments (Admin)

## Automation Pipeline

The system uses GitHub Actions to automatically generate new assignments every 14 days:

1. Collects user workload preferences
2. Runs the Groq-powered distribution algorithm
3. Deploys updated dashboard to Vercel
4. Sends Discord webhook with shared dashboard link

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the maintainers.
