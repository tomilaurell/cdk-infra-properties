import cdk = require("@aws-cdk/cdk");
import { initializeIfNeeded, resetEnvVariables } from "../envParamUtil";
import { loadCdkEnv } from "../cdkEnvUtil";
import { getAllFoldersForPath } from "../folderResolver";
import { loadVariablesOfFolder } from "../variableLoader";
import { writeVariablesFile } from "./serverlessVariableWriter";

export default async function generateServerlessVariables(app: cdk.Construct, path: string, parameterOverwrites?: any): Promise<void> {
  await initializeIfNeeded();

  // Reset env variables to initial ones
  resetEnvVariables();

  // Set env variables with property-files without overwriting initial ones
  const lookUpFolders = getAllFoldersForPath(path);
  for (const folder of lookUpFolders) {
    loadVariablesOfFolder(folder);
  }

  // Load cdk variables
  loadCdkEnv(app);

  const variables: any = {
    ...process.env,
    ...parameterOverwrites
  };

  await writeVariablesFile(path, variables);
}
