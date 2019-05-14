import cdk = require("@aws-cdk/cdk");
import fs = require("fs");
import generateServerlessVariables from "./generateServerlessVariables";

function removeFileIfExist(path: string) {
  try {
    fs.unlinkSync(path);
    //file removed
  } catch (err) {}
}

test("Branch specific serverless variables should be written", async () => {
  // Given
  const app = new cdk.App();
  app.node.setContext("aws:cdk:toolkit:default-account", "TEST_ACCOUNT");
  app.node.setContext("aws:cdk:toolkit:default-region", "DEFAULT_REGION");
  const pathToServerlessFolder = "./serverless-child";

  const variablesFilePath = `${pathToServerlessFolder}/infraVariables.yml`;
  removeFileIfExist(variablesFilePath);

  // When
  await generateServerlessVariables(app, "./serverless-child");

  // Then
  const content = fs.readFileSync(variablesFilePath, "utf8");
  expect(content.indexOf("SERVERLESS_REGION")).toBeGreaterThan(0);
  expect(content.indexOf("TEST_ACCOUNT")).toBeGreaterThan(0);
});
