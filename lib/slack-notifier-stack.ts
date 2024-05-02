import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda';
import * as snsSubscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as path from 'path';

const assetPath = path.join(__dirname, './lambdas/slack_notifier');

export class SlackNotifierStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slackNotificationTopic = new sns.Topic(this, 'SlackNotificationTopic', {
      displayName: 'Slack Notification Topic'
    });

    new cdk.CfnOutput(this, 'SlackNotificationTopicARN', {
      value: slackNotificationTopic.topicArn,
      exportName: `${this.stackName}-SlackNotificationTopicARN`
    })

    // Create a Lambda function for sending messages to Slack
    const sendToSlackFunction = new lambda.Function(this, 'SendToSlackFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(assetPath),
    });

    slackNotificationTopic.grantPublish(sendToSlackFunction);
    slackNotificationTopic.addSubscription(new snsSubscriptions.LambdaSubscription(sendToSlackFunction));
  }
}