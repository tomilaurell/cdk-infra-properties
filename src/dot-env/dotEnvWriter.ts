import fs = require("fs");

export function writeDotEnvFile(path: string, properties: any): Promise<void> {
  const fileName = `${path}/.env`;
  console.log(`Generating file: '${fileName}'`);

  const content = Object.keys(properties).reduce((value: string = "", key: string) => `${value}\n${key}=${properties[key]}`);
  console.log("Writing content", content);

  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, content, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}
