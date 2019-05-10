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
  const pathToServerlessFolder = "./serverless-child";
  const variablesFilePath = `${pathToServerlessFolder}/infraVariables.yml`;
  removeFileIfExist(variablesFilePath);

  // When
  await generateServerlessVariables("./serverless-child");

  // Then
  const content = fs.readFileSync(variablesFilePath, "utf8");
  expect(content.indexOf("SERVERLESS_REGION")).toBeGreaterThan(0);
});
