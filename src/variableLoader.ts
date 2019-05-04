import dotenv = require("dotenv");
import dotenvExpand = require("dotenv-expand");
import { getBasePropertyFileName, getEnvParameterPropertyFileName } from "./fileNameResolver";

export function loadVariablesOfFolder(path: string): void {
  const baseFile = getBasePropertyFileName(path);
  const envParameterFile = getEnvParameterPropertyFileName(path);
  const baseProps = dotenv.config({ path: envParameterFile });
  dotenvExpand(baseProps);
  const envParameterProps = dotenv.config({ path: baseFile });
  dotenvExpand(envParameterProps);
}
