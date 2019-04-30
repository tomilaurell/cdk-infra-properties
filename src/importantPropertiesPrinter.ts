import PropertiesReader = require("properties-reader");
import { getBasePropertyFileName, getEnvParameterPropertyFileName } from "./fileNameResolver";
import { paramEnvId, getAwsEnvVariables } from "./envParamUtil";

function getPropertiesOfFile(filePath: string): string[] {
  try {
    const properties = PropertiesReader(filePath);
    const flatProperties = properties.getAllProperties();
    return Object.keys(flatProperties);
  } catch (error) {
    return [];
  }
}

function getFilePropertyNames(folderPaths: string[]): string[] {
  let propertyNames: string[] = [];
  folderPaths.forEach(folderPath => {
    const baseFile = getBasePropertyFileName(folderPath);
    const envParameterFile = getEnvParameterPropertyFileName(folderPath);
    propertyNames = propertyNames.concat(getPropertiesOfFile(baseFile));
    propertyNames = propertyNames.concat(getPropertiesOfFile(envParameterFile));
  });
  return Array.from(new Set(propertyNames));
}

function getAllImportantProperties(folderPaths: string[]): any {
  const propertyNamesFromFiles = getFilePropertyNames(folderPaths);
  const awsPropertyNames = getAwsEnvVariables();
  const propertyNames = propertyNamesFromFiles.concat(awsPropertyNames);
  propertyNames.sort();

  const importantProperties: any = {};
  importantProperties.env = {
    account: process.env.ACCOUNT_ID,
    region: process.env.REGION
  };
  importantProperties[paramEnvId] = process.env[paramEnvId];
  propertyNames.forEach(key => {
    importantProperties[key] = process.env[key];
  });

  return importantProperties;
}

export function printAllImportantProperties(stackName: string, folderPaths: string[]): void {
  const importantProperties: any = getAllImportantProperties(folderPaths);
  console.debug(`Creating stack "${stackName}" with the following most important properties`, importantProperties);
}
