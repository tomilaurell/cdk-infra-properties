import cdk = require("@aws-cdk/cdk");
import { loadCdkEnv, ACCOUNT_ID, REGION } from "../cdkEnvUtil";
import { StackParams } from "../models";
import { initializeIfNeeded, resetEnvVariables } from "../envParamUtil";
import { getAllFoldersForPath } from "../folderResolver";
import { printAllImportantProperties } from "../importantPropertiesPrinter";
import { loadVariablesOfFolder } from "../variableLoader";

export default async function withParameters(params: StackParams): Promise<void> {
  await initializeIfNeeded();

  // Reset env variables to initial ones
  resetEnvVariables();

  // Set env variables with property-files without overwriting initial ones
  const lookUpFolders = params.path ? getAllFoldersForPath(params.path) : ["."];
  for (const folder of lookUpFolders) {
    loadVariablesOfFolder(folder);
  }
  // Set cdk properties not overwriting anything already set
  loadCdkEnv(params.app);

  // Print most important properties. Basically those found in property-files and couple of others.
  printAllImportantProperties(params.stackName, lookUpFolders);

  const stackParams: cdk.StackProps = {
    ...process.env,
    env: {
      account: process.env[ACCOUNT_ID],
      region: process.env[REGION]
    },
    ...params.stackProps
  };

  await new params.stack(params.app, params.stackName, stackParams);
}