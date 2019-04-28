import cdk = require("@aws-cdk/cdk");
import dotenv = require("dotenv");
import dotenvExpand = require("dotenv-expand");
import PropertiesReader = require("properties-reader");
import envParameterUtil from "./envParameterUtil";
const branchName = require("branch-name");
import _ = require("lodash");

const paramEnvId = "paramEnvId";
const GIT_BRANCH = "GIT_BRANCH";

let envVariables: any;

export interface StackParams {
  app: cdk.Construct;
  stack: any;
  stackName: string;
  path?: string;
}

export interface BaseStackProps extends cdk.StackProps {
  account: string;
  paramEnvId: string;
  region: string;
  AWS_PROFILE: string;
}

async function getBranchName() {
  return branchName.get().then((name: string) => {
    return name;
  });
}

async function setBranchName() {
  if (!process.env[GIT_BRANCH]) {
    const branchName = await getBranchName();
    process.env[GIT_BRANCH] = branchName;
  }
}

async function setParamEnvId() {
  if (!process.env[paramEnvId]) {
    process.env[paramEnvId] = process.env[GIT_BRANCH];
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
  return `${path}/infra-${envParameterUtil(paramEnvId)}.properties`;
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

function cdkEnv(app: cdk.Construct): cdk.Environment {
  return {
    account: app.node.getContext("aws:cdk:toolkit:default-account"),
    region: app.node.getContext("aws:cdk:toolkit:default-region")
  };
}

function printAllMeaningfullProperties(app: cdk.Construct, stackName: string, folderPaths: string[]): any {
  const propertyNamesFromFiles = getAllMeaningfullProperties(folderPaths);
  const awsPropertyNames = getAwsEnvVariables();
  const propertyNames = propertyNamesFromFiles.concat(awsPropertyNames);
  propertyNames.sort();

  const meaningfullProperties: any = {};
  propertyNames.forEach(key => {
    meaningfullProperties[key] = process.env[key];
  });
  meaningfullProperties[paramEnvId] = process.env[paramEnvId];

  const cdkProperties = cdkEnv(app);

  const allMeaningfullProperties = {
    ...meaningfullProperties,
    ...cdkProperties
  };

  console.log(`Creating stack "${stackName}" with properties`, allMeaningfullProperties);

  return allMeaningfullProperties;
}

export default async function withParameters(params: StackParams) {
  if (!envVariables) {
    await setBranchName();
    await setParamEnvId();
  }

  backupInitialEnvVariables();
  resetEnvVariables();

  const lookUpFolders = params.path ? getAllFoldersForPath(params.path) : ["."];
  for (const folder of lookUpFolders) {
    loadVariablesOfFolder(folder);
  }
  const properties = printAllMeaningfullProperties(params.app, params.stackName, lookUpFolders);

  await new params.stack(params.app, params.stackName, properties);
}
