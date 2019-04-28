import withParameters from "./withParameters";
import envParameterUtil from "./envParameterUtil";

test("Branch specific properties-file should override", async () => {
  process.env.GIT_BRANCH = "test";
  await withParameters(() => {
    expect(envParameterUtil("TEST_PARAM_PARENT")).toEqual("MASTER");
    expect(envParameterUtil("TEST_PARAM_CHILD")).toEqual("TEST");
  });
});
