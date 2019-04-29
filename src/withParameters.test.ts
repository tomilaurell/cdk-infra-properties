import cdk = require("@aws-cdk/cdk");
import withParameters, { BaseStackProps } from "./withParameters";

export interface TestStactProps extends BaseStackProps {
  ENV_PARAM: string;
  GIT_BRANCH: string;
  TEST_PARAM_PARENT: string;
  TEST_PARAM_BRANCH_OVERRIDE: string;
  TEST_PARAM_CHILD: string;
  TEST_PARAM_CHILD_BRANCH_OVERRIDE: string;
}

test("Branch specific properties-file should override", async () => {
  process.env.GIT_BRANCH = "test";

  const app = new cdk.App();
  app.node.setContext("aws:cdk:toolkit:default-account", "TEST_ACCOUNT");
  app.node.setContext("aws:cdk:toolkit:default-region", "DEFAULT_REGION");

  class TestStack1 {
    constructor(appParam: cdk.Construct, stackName: string, props: TestStactProps) {
      expect(appParam).toEqual(app);
      expect(stackName).toEqual("Test Stack 1");
      expect(props.paramEnvId).toEqual("test");

      expect(props.GIT_BRANCH).toEqual("test");
      expect(props.ENV_PARAM).toEqual("NOT_WRITABLE");
      expect(props.account).toEqual("TEST_ACCOUNT");
      expect(props.region).toEqual("DEFAULT_REGION");

      expect(props.TEST_PARAM_PARENT).toEqual("PARENT");
      expect(props.TEST_PARAM_BRANCH_OVERRIDE).toEqual("PARENT_TEST");
      expect(props.TEST_PARAM_CHILD).toEqual("CHILD");
      expect(props.TEST_PARAM_CHILD_BRANCH_OVERRIDE).toEqual("CHILD_TEST");
    }
  }

  class TestStack2 {
    constructor(appParam: cdk.Construct, stackName: string, props: TestStactProps) {
      expect(appParam).toEqual(app);
      expect(stackName).toEqual("Test Stack 2");
      expect(props.paramEnvId).toEqual("test");

      expect(props.GIT_BRANCH).toEqual("test");
      expect(props.ENV_PARAM).toEqual("NOT_WRITABLE");
      expect(props.account).toEqual("OTHER_ACCOUNT");
      expect(props.region).toEqual("OTHER_REGION");

      expect(props.TEST_PARAM_PARENT).toEqual("PARENT");
      expect(props.TEST_PARAM_BRANCH_OVERRIDE).toEqual("PARENT_TEST");
    }
  }

  process.env.ENV_PARAM = "NOT_WRITABLE";

  await withParameters({
    app: app,
    stackName: "Test Stack 1",
    stack: TestStack1,
    path: "./child"
  });

  await withParameters({
    app: app,
    stackName: "Test Stack 2",
    stack: TestStack2,
    path: "./child2"
  });
});
