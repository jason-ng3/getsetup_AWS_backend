import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';

const assetPath = path.join(__dirname, './lambdas/multiply');

interface MyStackProps extends cdk.StackProps {
  slackNotificationTopicArn?: string;
  dependencies?: [];
}

export class GetsetupApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: MyStackProps) {
    super(scope, id, props);

    const multiplyFunction = new lambda.Function(this, 'MultiplyFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(assetPath)
    });

    multiplyFunction.role?.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['sns:ListTopics', 'sns:Publish'],
      resources: ['*']
    }));

    const api = new apigateway.RestApi(this, 'MultiplicationAPI');
    const multiplyIntegration = new apigateway.LambdaIntegration(multiplyFunction);
    api.root.addResource('multiply').addMethod('POST', multiplyIntegration);
  }
}
