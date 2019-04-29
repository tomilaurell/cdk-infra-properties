import _ = require("lodash");
import { getBranchName } from "./branchNameResolver";

export const paramEnvId: string = "paramEnvId";
const GIT_BRANCH: string = "GIT_BRANCH";

let envVariables: any;

function setBranchName(branchName: string) {
  if (!process.env[GIT_BRANCH]) {
    process.env[GIT_BRANCH] = branchName;
  }
}

function setParamEnvId(): void {
  if (!process.env[paramEnvId]) {
    process.env[paramEnvId] = process.env[GIT_BRANCH];
  }
}

export async function initializeIfNeeded(): Promise<void> {
  if (!envVariables) {
    // Enhace base env variables with branch name and paramEnvId
    const branchName = await getBranchName();
    setBranchName(branchName);
    await setParamEnvId();

    // Take copy of base set of env variables
    envVariables = _.clone(process.env);
  }
}

export function resetEnvVariables(): void {
  process.env = _.clone(envVariables);
}

export function getAwsEnvVariables(): string[] {
  return Object.keys(envVariables).filter(key => key.startsWith("AWS"));
}
