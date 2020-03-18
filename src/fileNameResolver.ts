import { paramEnvId } from "./envParamUtil";

export function getBasePropertyFileName(path: string): string {
  return `${path}/infra.properties`;
}

export function getEnvParameterPropertyFileName(path: string): string {
  return `${path}/infra-${process.env[paramEnvId]}.properties`;
}

export function getLocalParameterPropertyFileName(path: string): string {
  return `${path}/infra-local.properties`;
}
