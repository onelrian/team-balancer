import fetch from 'node-fetch';

export class DiscordService {
  private static webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';

  // Send a notification about new assignments
  static async sendNewAssignmentsNotification(assignmentsCount: number, cycleDate: Date) {
    if (!this.webhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL not configured, skipping notification');
      return;
    }

    try {
      const vercelUrl = process.env.VERCEL_URL || 'https://team-balancer.vercel.app';
      
      const payload = {
        content: '🎉 New workload distribution has been generated!',
        embeds: [{
          title: 'TeamBalancer Update',
          description: `The workload distribution has been updated for the current cycle.\n\n**${assignmentsCount}** work portions have been assigned.`,
          color: 3447003, // Blue color
          fields: [
            {
              name: '📅 Cycle Date',
              value: cycleDate.toISOString().split('T')[0],
              inline: true
            },
            {
              name: '🔗 Dashboard',
              value: `[View Dashboard](${vercelUrl})`,
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'TeamBalancer Workload Distribution System'
          }
        }]
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook failed with status ${response.status}`);
      }

      console.log('Discord notification sent successfully');
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      // Don't throw error as this shouldn't break the main flow
    }
  }

  // Send a notification about a new work portion
  static async sendNewWorkPortionNotification(workPortionName: string, createdBy: string) {
    if (!this.webhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL not configured, skipping notification');
      return;
    }

    try {
      const vercelUrl = process.env.VERCEL_URL || 'https://team-balancer.vercel.app';
      
      const payload = {
        content: '🆕 New work portion created!',
        embeds: [{
          title: 'TeamBalancer Update',
          description: `A new work portion has been added to the system.`,
          color: 3066993, // Green color
          fields: [
            {
              name: '📝 Work Portion',
              value: workPortionName,
              inline: true
            },
            {
              name: '👤 Created By',
              value: createdBy,
              inline: true
            },
            {
              name: '🔗 Dashboard',
              value: `[View Dashboard](${vercelUrl})`,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'TeamBalancer Workload Distribution System'
          }
        }]
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook failed with status ${response.status}`);
      }

      console.log('Discord notification sent successfully');
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      // Don't throw error as this shouldn't break the main flow
    }
  }

  // Send a notification about a system error
  static async sendErrorNotification(errorMessage: string) {
    if (!this.webhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL not configured, skipping notification');
      return;
    }

    try {
      const payload = {
        content: '@here ⚠️ TeamBalancer System Error!',
        embeds: [{
          title: 'System Error',
          description: 'An error occurred in the TeamBalancer system.',
          color: 15158332, // Red color
          fields: [
            {
              name: '❌ Error Message',
              value: errorMessage,
              inline: false
            },
            {
              name: '🕐 Time',
              value: new Date().toISOString(),
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'TeamBalancer Workload Distribution System'
          }
        }]
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook failed with status ${response.status}`);
      }

      console.log('Error notification sent to Discord');
    } catch (error) {
      console.error('Failed to send error notification to Discord:', error);
      // Don't throw error as this shouldn't break the main flow
    }
  }
}