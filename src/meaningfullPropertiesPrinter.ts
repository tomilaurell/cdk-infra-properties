import cdk = require("@aws-cdk/cdk");
import PropertiesReader = require("properties-reader");
import { getBasePropertyFileName, getEnvParameterPropertyFileName } from "./fileNameResolver";
import { paramEnvId, getAwsEnvVariables } from "./envParamUtil";
import { getCdkEnv } from "./cdkEnvUtil";

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

function getAllImportantProperties(app: cdk.Construct, folderPaths: string[]): any {
  const propertyNamesFromFiles = getFilePropertyNames(folderPaths);
  const awsPropertyNames = getAwsEnvVariables();
  const propertyNames = propertyNamesFromFiles.concat(awsPropertyNames);
  propertyNames.sort();

  const meaningfullProperties: any = getCdkEnv(app);

  // property files overwrite cdkEnv-properties
  propertyNames.forEach(key => {
    meaningfullProperties[key] = process.env[key];
  });
  meaningfullProperties[paramEnvId] = process.env[paramEnvId];

  return meaningfullProperties;
}

export function printAllImportantProperties(app: cdk.Construct, stackName: string, folderPaths: string[]): void {
  const meaningfullProperties: any = getAllImportantProperties(app, folderPaths);
  console.debug(`Creating stack "${stackName}" with the following most important properties`, meaningfullProperties);
}
