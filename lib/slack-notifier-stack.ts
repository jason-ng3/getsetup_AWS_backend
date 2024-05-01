import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';

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
  }
}