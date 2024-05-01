const AWS = require('aws-sdk');
const sns = new AWS.SNS();

type APIGatewayProxyResult = {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
};

export async function handler(event: any): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    throw new Error('Request data is missing');
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);

    if (typeof parsedBody.num1 !== 'number' || typeof parsedBody.num2 !== 'number') {
      throw new Error('Invalid request data: num1 and num2 must be numbers');
    } 
  } catch (error: any) {
    throw new Error('Error parsing request body as JSON: ' + error.message);
  }

  const { num1, num2, slackChannel } = parsedBody;
  const result = num1 * num2;

  const slackResponse = {
    message: `Calculated result: ${num1} * ${num2} = ${result}`,
    slackChannel: slackChannel,
  };

  const apiResponse = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ result })
  };

  if (slackChannel) {
    const topicList = await sns.listTopics().promise();
    const topic = topicList.Topics.find((t: any) => t.TopicArn && t.TopicArn.includes('SlackNotificationTopic'));
    if (topic && topic.TopicArn) {
      await sns.publish({
        Message: JSON.stringify(slackResponse),
        TopicArn: topic.TopicArn,
      }).promise();
    } else {
      throw new Error('No valid SNS topic found');
    }
  }
  
  return apiResponse;
}
