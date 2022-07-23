import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'todo',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    stage: "${opt:stage,'dev'}",
    region: "ap-northeast-2",
    runtime: 'nodejs14.x',
    timeout: 30,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ["dynamodb:*"],
        Resource: ["arn:aws:dynamodb:*:*"]
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NODE_DEV: "${self:provider.stage}",
      DB_PREFIX: "${self:custom.DB_PREFIX}"
    },
  },
  // import the function via paths
  functions: {
    hello,
    TodoGetAll: {
      handler: 'src/todo/all.all',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos/all',
            cors: true,
          }
        }
      ]
    },
    TodoAdd: {
      handler: 'src/todo/add.add',
      events: [
        {
          http: {
            method: 'post',
            path: 'todo',
            cors: true,
          }
        }
      ]
    },
    TodoGet: {
      handler: 'src/todo/get.get',
      events: [
        {
          http: {
            method: 'get',
            path: 'todo/{id}',
            cors: true,
          }
        }
      ]
    },
    TodoUpdate: {
      handler: 'src/todo/update.update',
      events: [
        {
          http: {
            method: 'patch',
            path: 'todo',
            cors: true,
          }
        }
      ]
    },
    TodoList: {
      handler: 'src/todo/list.list',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos',
            cors: true,
          }
        }
      ]
    },
    TodoDelete: {
      handler: 'src/todo/delete.del',
      events: [
        {
          http: {
            method: 'delete',
            path: 'todo/{id}',
            cors: true,
          }
        }
      ]
    },
  },
  package: {
    individually: true,
    exclude: [
      'node_modules/**',
      'migrations/**',
      '.dynamodb/**',
      '.git/**'
    ]
  },
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
    DB_PREFIX: "${self:provider.stage}",
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: true
      },
      seed: {
        dev: {
          sources: [
            {
              table: "${self:custom.DB_PREFIX}_todos",
              sources: ['./migrations/todos-seed.json']   // fixme
            }
          ]
        }
      }
    }
  },
  resources: {
    Resources: {
      OrdersTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: "${self:custom.DB_PREFIX}_todos",
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 3,
            WriteCapacityUnits: 3
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
