import cdk = require("@aws-cdk/cdk");
import withParameters, { StackParams } from "./withParameters";

test("Branch specific properties-file should override", async () => {
  process.env.GIT_BRANCH = "test";

  const app = new cdk.App();

  class TestStack {
    constructor(appParam: cdk.Construct, stackName: string, props: any) {
      expect(appParam).toEqual(app);
      expect(stackName).toEqual("Test Stack");
      expect(props.TEST_PARAM_PARENT).toEqual("MASTER");
      expect(props.TEST_PARAM_CHILD).toEqual("TEST");
      expect(props.paramEnvId).toEqual("test");
    }
  }

  const params: StackParams = {
    app: app,
    stackName: "Test Stack",
    stack: TestStack
  };
  await withParameters(params);
});
