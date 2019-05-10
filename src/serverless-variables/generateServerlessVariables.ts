import { initializeIfNeeded, resetEnvVariables } from "../envParamUtil";
import { getAllFoldersForPath } from "../folderResolver";
import { loadVariablesOfFolder } from "../variableLoader";
import { writeVariablesFile } from "./serverlessVariableWriter";

export default async function generateServerlessVariables(path: string, parameterOverwrites?: any): Promise<void> {
  await initializeIfNeeded();

  // Reset env variables to initial ones
  resetEnvVariables();

  // Set env variables with property-files without overwriting initial ones
  const lookUpFolders = getAllFoldersForPath(path);
  for (const folder of lookUpFolders) {
    loadVariablesOfFolder(folder);
  }

  const variables: any = {
    ...process.env,
    ...parameterOverwrites
  };

  await writeVariablesFile(path, variables);
}
