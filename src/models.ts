import core = require('@aws-cdk/core');

export interface StackParams {
  app: core.Construct;
  stack: any;
  stackName: string;
  path?: string;
  stackProps?: core.StackProps;
}

export interface BaseStackProps extends core.StackProps {
  paramEnvId: string;
  AWS_PROFILE: string;
  ACCOUNT_ID: string
  REGION: string
}
