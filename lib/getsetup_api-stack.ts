import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as path from 'path';

const assetPath = path.join(__dirname, 'lambdas', 'multiply');

export class GetsetupApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const multiplyFunction = new lambda.Function(this, 'MultiplyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(assetPath)
    });

    const api = new apigateway.RestApi(this, 'MultiplicationAPI');
    const multiplyIntegration = new apigateway.LambdaIntegration(multiplyFunction);
    api.root.addResource('multiply').addMethod('POST', multiplyIntegration);
  }
}
