import { sanitize } from "./branchNameResolver";

test("Sanitize slashes in names", () => {
  const result = sanitize("feature/name");
  expect(result).toEqual("feature-name");
});
