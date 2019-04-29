import cdk = require("@aws-cdk/cdk");

export interface StackParams {
  app: cdk.Construct;
  stack: any;
  stackName: string;
  path?: string;
}

export interface BaseStackProps extends cdk.StackProps {
  account: string;
  paramEnvId: string;
  region: string;
  AWS_PROFILE: string;
}
