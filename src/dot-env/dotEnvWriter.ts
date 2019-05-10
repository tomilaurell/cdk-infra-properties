import fs = require("fs");

export function writeDotEnvFile(path: string, properties: any): Promise<void> {
  const fileName = `${path}/.env`;
  console.log(`Generating file: '${fileName}'`);

  const content = Object.keys(properties)
    .map((key: string) => `${key}=${properties[key]}`)
    .reduce((v: string = "", n: string) => `${v}\n${n}`);

  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, content, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}
