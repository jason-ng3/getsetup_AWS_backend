# Prerequisites:
In order to run the project, have the following prerequisites set up on your system:
1. An AWS account
2. Node.js v16
3. AWS Command Line Interface (CLI) v1.204.0
  - Global installation command: `npm install -g aws-cdk@1.204.0`
4. Clone the CDK project from GitHub.
5. From the lib/lambdas/slack_notifier directory, run `npm install` to install the Slack Client dependency for the slack notifier Lambda.
6. From the root project directory, install dependencies by running `npm install`.
7. Set up AWS credentials:
  1. Configure AWS credentials (AWS access key ID & secret access key) on the CLI using `aws configure`.
8. Run `cdk bootstrap` to bootstrap environment for deploying AWS CloudFormation stacks.
9. Run `tsc` to transpile TypeScript to JavaScript. 
10. Run `cdk deploy --all` to deploy the serverless backend. 
11. Store your Slack API token as an environment variable using the AWS console: within the Configuration tab of the SlackNotifierStack-SendToSlackFunction Lambda function.

# High-Level Design:
The high-level architectural design starting from the client and ending at the Slack channel:
1. The **Client** initiates a POST request, the request body of which consists of two numbers and optionally a Slack channel name to send the result of the multiplication operation to.
{
    "num1": 10,
    "num2": 5,
    "slackChannel": '#multiplication
}

2. The POST request is handled via an **API Gateway**, which integrates with a **multiplication Lambda function**. 
3. The **multiplication Lambda** calculates the result of multiplying the numbers, and sends a response containing the result back to the **Client**. 
4. If the Client added a slackChannel property to the POST request body, the **Lambda** publishes a message containing the result and the Slack channel to an **SNS Topic**.
5. A **slack notifier Lambda** is subscribed to the **SNS Topic** and sends the message to the specified Slack channel using the Slack client and your Slack API token, which is stored as an environment variable in the slack notifier Lambda. 

# Testing
1. Use Postman to test the API Gateway endpoint with a POST request containing just two numbers, which should return a 200 response and a JSON payload of the result.
2. Use Postman to test the API Gateway endpoint with a POST request containing two numbers and a Slack channel name (ex. #multiplication), which should return a 200 response and a JSON payload of the result, and successfully send a message to the specified Slack channel associated with the Slack API token connected with your workspace.
