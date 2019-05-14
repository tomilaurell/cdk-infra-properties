import cdk = require("@aws-cdk/cdk");
import _ = require("lodash");
import { initializeIfNeeded, resetEnvVariables } from "./envParamUtil";
import { loadCdkEnv } from "./cdkEnvUtil";
import { getAllFoldersForPath } from "./folderResolver";
import { loadVariablesOfFolder } from "./variableLoader";

function overwriteEnvVariables(props: any) {
  Object.keys(props).forEach(key => (process.env[key] = props[key]));
}

export async function loadParametersToEnv(app: cdk.Construct, path?: string, parameterOverwrites?: any): Promise<void> {
  await initializeIfNeeded();

  // Reset env variables to initial ones
  resetEnvVariables();

  const backupVariables = _.clone(process.env);

  // Set cdk properties not overwriting anything already set
  loadCdkEnv(app);

  // Set env variables with property-files without overwriting initial ones
  const lookUpFolders = path ? getAllFoldersForPath(path) : ["."];
  for (const folder of lookUpFolders) {
    loadVariablesOfFolder(folder);
  }

  overwriteEnvVariables(backupVariables);

  if (parameterOverwrites) {
    overwriteEnvVariables(parameterOverwrites);
  }
}
