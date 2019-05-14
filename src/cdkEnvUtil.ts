import cdk = require("@aws-cdk/cdk");

export const REGION = "REGION";
export const ACCOUNT_ID = "ACCOUNT_ID";

export interface CdkEnv {
  account: string;
  region: string;
}

export function loadCdkEnv(app: cdk.Construct): CdkEnv {
  const cdkEnv: CdkEnv = {
    account: app.node.getContext("aws:cdk:toolkit:default-account"),
    region: app.node.getContext("aws:cdk:toolkit:default-region")
  };
  if (!process.env[REGION]) {
    process.env[REGION] = cdkEnv.region;
  }
  if (!process.env[ACCOUNT_ID]) {
    process.env[ACCOUNT_ID] = cdkEnv.account;
  }
  return cdkEnv;
}
