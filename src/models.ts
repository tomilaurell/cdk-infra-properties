import cdk = require("@aws-cdk/cdk");

export interface StackParams {
  app: cdk.Construct;
  stack: any;
  stackName: string;
  path?: string;
  stackProps?: cdk.StackProps;
}

export interface BaseStackProps extends cdk.StackProps {
  paramEnvId: string;
  AWS_PROFILE: string;
}
