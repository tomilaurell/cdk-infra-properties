import core = require('@aws-cdk/core');
import {writeVariablesFile} from "./serverlessVariableWriter";
import {loadParametersToEnv} from "../loadParametersToEnv";

export default async function generateServerlessVariables(app: core.Construct, path: string, parameterOverwrites?: any): Promise<void> {
  await loadParametersToEnv(app, path, parameterOverwrites);

  const variables: any = {
    ...process.env,
    ...parameterOverwrites
  };

  await writeVariablesFile(path, variables);
}
