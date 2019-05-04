import yaml = require("js-yaml");
import fs = require("fs");

export function writeVariablesFile(path: string, properties: any): Promise<void> {
  const yarmContent = yaml.safeDump(properties, {
    sortKeys: true // sort object keys
  });
  const fileName = `${path}/infraVariables.yml`;
  console.log(`Generating file: '${fileName}'`);

  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, yarmContent, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}
