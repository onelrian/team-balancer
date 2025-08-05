#!/usr/bin/env node

// Script to send Discord notification
import fetch from 'node-fetch';

async function sendDiscordNotification() {
  try {
    console.log('Sending Discord notification...');
    
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const vercelUrl = process.env.VERCEL_URL || 'https://team-balancer.vercel.app';
    
    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL environment variable not set');
      process.exit(1);
    }
    
    // Create the message payload
    const payload = {
      content: '🎉 New workload distribution has been generated!',
      embeds: [{
        title: 'TeamBalancer Update',
        description: 'The workload distribution has been updated for the current cycle.',
        color: 3447003, // Blue color
        fields: [
          {
            name: '📅 Cycle Date',
            value: new Date().toISOString().split('T')[0],
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
    
    // Send the webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send Discord notification: ${response.status} ${response.statusText}`);
    }
    
    console.log('Discord notification sent successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    process.exit(1);
  }
}

// Run the script
sendDiscordNotification();