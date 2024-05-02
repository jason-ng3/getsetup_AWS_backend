import { SNSHandler } from 'aws-lambda';
import { WebClient } from '@slack/client';

// Initialize a new WebClient instance with your Slack token
const web = new WebClient(process.env.SLACK_API_TOKEN);

export const handler: SNSHandler = async (event) => {
  try {
    // Extract message and channel from the SNS event
    const snsMessage = JSON.parse(event.Records[0].Sns.Message);
    console.log(snsMessage);
    const channel = snsMessage.slackChannel;
    const message = snsMessage.message;
    console.log(channel);
    console.log(message);

    // Send the message to Slack channel
    await web.chat.postMessage({
      channel: channel,
      text: message,
    });

    console.log('Message sent to Slack channel:', message);
  } catch (error) {
    console.error('Error sending message to Slack:', error);
  }
};
