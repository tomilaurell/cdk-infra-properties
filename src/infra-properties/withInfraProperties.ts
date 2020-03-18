import core = require('@aws-cdk/core');
import { ACCOUNT_ID, REGION } from "../cdkEnvUtil";
import { StackParams } from "../models";
import { getAllFoldersForPath } from "../folderResolver";
import { printAllImportantProperties } from "../importantPropertiesPrinter";
import { loadParametersToEnv } from "../loadParametersToEnv";

export default async function withParameters(params: StackParams): Promise<void> {
  await loadParametersToEnv(params.app, params.path, params.stackProps);

  // Print most important properties. Basically those found in property-files and couple of others.
  const lookUpFolders = params.path ? getAllFoldersForPath(params.path) : ["."];
  printAllImportantProperties(params.stackName, lookUpFolders);

  const stackParams: core.StackProps = {
    ...process.env,
    env: {
      account: process.env[ACCOUNT_ID],
      region: process.env[REGION]
    },
    ...params.stackProps
  };

  await new params.stack(params.app, params.stackName, stackParams);
}
