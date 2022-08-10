import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "eu-central-1",
    stage: "dev",
    profile: "serverless",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: process.env.BUCKET_NAME,
      BUCKET_REGION: process.env.BUCKET_REGION,
      SQS_URL: {
        Ref: 'CatalogItemsQueue'
      },
      // SNS_TOPIC_ARN: {
			// 	Ref: 'createProductTopic'
			// }
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: [
          'arn:aws:s3:::${env:BUCKET_NAME}'
        ]
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          'arn:aws:s3:::${env:BUCKET_NAME}/*'
        ]
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          { "Fn::GetAtt": ["CatalogItemsQueue", "Arn"] },
        ],
      },
    ]
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'task-6-q',
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
    },
    Outputs: {
      CatalogItemsQueue: {
        Value: {
          Ref: "CatalogItemsQueue",
        },
        Export: {
          Name: "CatalogItemsQueue",
        },
      },
      CatalogItemsQueueUrl: {
        Value: {
          Ref: 'CatalogItemsQueue'
        },
        Export: {
          Name: 'CatalogItemsQueueUrl'
        }
      },
      CatalogItemsQueueArn: {
        Value: {
          "Fn::GetAtt": ["CatalogItemsQueue", "Arn"],
        },
        Export: {
          Name: "CatalogItemsQueueArn",
        },
      },
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
