import PropertiesReader = require("properties-reader");
import {
  getBasePropertyFileName,
  getEnvParameterPropertyFileName,
  getLocalParameterPropertyFileName
} from "./fileNameResolver";
import {expandString} from "./stringExpansionUtil";

interface Params {
  [name: string]: string;
}

function parseVariables(path: string): Params {
  try {
    const properties = PropertiesReader(path);
    const flatProperties = properties.getAllProperties();
    const mappedroperties: { [name: string]: string } = {};
    Object.keys(flatProperties).forEach(key => {
      mappedroperties[key] = `${flatProperties[key]}`;
    });
    return mappedroperties;
  } catch (error) {
    return {};
  }
}

function expandVariables(params: Params): Params {
  const result: Params = {};
  Object.keys(params).forEach(key => {
    const value = params[key];
    const expandedValue = expandString(value);
    result[key] = expandedValue;
  });
  return result;
}

function loadVariables(path: string): void {
  const props = parseVariables(path);
  const expandedProps = expandVariables(props);
  for (let k in expandedProps) {
    if (process.env[k]) {
      console.log(`${process.env[k]}: ${process.env[k]} -> ${expandedProps[k]}`);
    }
    process.env[k] = expandedProps[k];
  }
}

export function loadVariablesOfFolder(path: string): void {
  const baseFile = getBasePropertyFileName(path);
  const envParameterFile = getEnvParameterPropertyFileName(path);
  const localParameterFile = getLocalParameterPropertyFileName(path);

  loadVariables(baseFile);
  loadVariables(envParameterFile);
  loadVariables(localParameterFile);
}
