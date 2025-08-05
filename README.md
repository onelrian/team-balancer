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

For detailed setup instructions, please refer to [SETUP.md](SETUP.md).

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/team-balancer.git
   cd team-balancer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure the required environment variables (see [SETUP.md](SETUP.md) for details)

5. Set up the database:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

6. Run the development server:
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
