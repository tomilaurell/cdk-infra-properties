import cdk = require("@aws-cdk/cdk");

export interface CdkEnv {
  account: string;
  region: string;
}

export function getCdkEnv(app: cdk.Construct): CdkEnv {
  return {
    account: app.node.getContext("aws:cdk:toolkit:default-account"),
    region: app.node.getContext("aws:cdk:toolkit:default-region")
  };
}
