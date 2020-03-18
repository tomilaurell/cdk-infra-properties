import core = require('@aws-cdk/core');
import {loadParametersToEnv} from "../loadParametersToEnv";
import {writeDotEnvFile} from "./dotEnvWriter";

export default async function generateServerlessVariables(app: core.Construct, path: string, parameterOverwrites?: any): Promise<void> {
  await loadParametersToEnv(app, path, parameterOverwrites);

  const variables: any = {
    ...process.env,
    ...parameterOverwrites
  };

  await writeDotEnvFile(path, variables);
}
