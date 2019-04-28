const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const PropertiesReader = require("properties-reader");
const branchName = require("branch-name");
import _ = require("lodash");

let envVariables: any;

async function getBranchName() {
  return branchName.get().then((name: string) => {
    return name;
  });
}

async function setBranchName() {
  if (!envVariables) {
    const branchName = await getBranchName();
    console.log("Resolved branchName " + branchName);
    process.env.GIT_BRANCH = branchName;
  }
}

function backupInitialEnvVariables() {
  if (!envVariables) {
    envVariables = _.clone(process.env);
  }
}

function resetEnvVariables() {
  process.env = _.clone(envVariables);
}

function getBasePropertyFileName(path: string): string {
  return `${path}/infra.properties`;
}

function getEnvParameterPropertyFileName(path: string): string {
  const envParameter = "master";
  return `${path}/infra-${envParameter}.properties`;
}

function loadVariablesOfFolder(path: string) {
  const baseFile = getBasePropertyFileName(path);
  const envParameterFile = getEnvParameterPropertyFileName(path);
  const baseProps = dotenv.config({ path: envParameterFile });
  dotenvExpand(baseProps);
  const envParameterProps = dotenv.config({ path: baseFile });
  dotenvExpand(envParameterProps);
}

function getAllFoldersForPath(pathToStack: string): string[] {
  const folderParts = _.split(pathToStack, "/");
  let folderIterator: string;
  const folders = folderParts.map(folderPart => {
    folderIterator = folderIterator ? `${folderIterator}/${folderPart}` : folderPart;
    return folderIterator;
  });
  _.reverse(folders);
  return folders;
}

function getPropertiesOfFile(filePath: string): string[] {
  try {
    const properties = PropertiesReader(filePath);
    const flatProperties = properties.getAllProperties();
    return Object.keys(flatProperties);
  } catch (error) {
    return [];
  }
}

function getAllMeaningfullProperties(folderPaths: string[]): string[] {
  let propertyNames: string[] = [];
  folderPaths.forEach(folderPath => {
    const baseFile = getBasePropertyFileName(folderPath);
    const envParameterFile = getEnvParameterPropertyFileName(folderPath);
    propertyNames = propertyNames.concat(getPropertiesOfFile(baseFile));
    propertyNames = propertyNames.concat(getPropertiesOfFile(envParameterFile));
  });
  return Array.from(new Set(propertyNames));
}

function getAwsEnvVariables(): string[] {
  return Object.keys(envVariables).filter(key => key.startsWith("AWS"));
}

function printAllMeaningfullProperties(functionParam: Function, folderPaths: string[]) {
  const propertyNamesFromFiles = getAllMeaningfullProperties(folderPaths);
  const awsPropertyNames = getAwsEnvVariables();
  const propertyNames = propertyNamesFromFiles.concat(awsPropertyNames);
  propertyNames.sort();

  const meaningfullProperties: any = {};
  propertyNames.forEach(key => {
    meaningfullProperties[key] = process.env[key];
  });

  console.log(`Running function "${functionParam}" with properties`, meaningfullProperties);
}

export default async function withParameters(functionParam: Function, pathToStack?: string) {
  if (!functionParam) {
    throw "Function must be defined";
  }

  await setBranchName();
  backupInitialEnvVariables();
  resetEnvVariables();

  if (pathToStack) {
    const folders = getAllFoldersForPath(pathToStack);
    for (const folder of folders) {
      loadVariablesOfFolder(folder);
    }
    printAllMeaningfullProperties(functionParam, folders);
  } else {
    const defaultFolder = ".";
    loadVariablesOfFolder(defaultFolder);
    printAllMeaningfullProperties(functionParam, [defaultFolder]);
  }
  await functionParam();
}
