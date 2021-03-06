import core = require('@aws-cdk/core');
import withInfraProperties from "./withInfraProperties";
import {BaseStackProps} from "../models";

export interface TestStactProps extends BaseStackProps {
  ENV_PARAM: string;
  GIT_BRANCH: string;
  TEST_EXPANDING: string;
  TEST_EXPANDING_IN_SAME_FILE: string;
  TEST_PARAM_PARENT: string;
  TEST_PARAM_BRANCH_OVERRIDE: string;
  TEST_PARAM_CHILD: string;
  TEST_PARAM_CHILD_BRANCH_OVERRIDE: string;
  TEST_PARAM_CHILD_LOCAL_OVERRIDE: string
}

test("Branch specific properties-file should override", async () => {
  process.env.GIT_BRANCH = "test";

  const app = new core.App({ context: {
      "aws:cdk:toolkit:default-account": "TEST_ACCOUNT",
      "aws:cdk:toolkit:default-region": "DEFAULT_REGION"
    }})

  class TestStack1 {
    constructor(appParam: core.Construct, stackName: string, props: TestStactProps) {
      expect(appParam).toEqual(app);
      expect(stackName).toEqual("Test Stack 1");
      expect(props.paramEnvId).toEqual("test");
      expect(props.description).toEqual("Description");

      expect(props.GIT_BRANCH).toEqual("test");
      expect(props.ENV_PARAM).toEqual("NOT_WRITABLE");

      if (props.env) {
        expect(props.env.account).toEqual("TEST_ACCOUNT");
        expect(props.env.region).toEqual("DEFAULT_REGION");
      } else {
        throw "props.env should not be null";
      }

      expect(props.TEST_EXPANDING).toEqual("PREFIX_DEFAULT_REGION");
      expect(props.TEST_EXPANDING_IN_SAME_FILE).toEqual("PREFIX_PREFIX_DEFAULT_REGION");
      expect(props.TEST_PARAM_PARENT).toEqual("PARENT");
      expect(props.TEST_PARAM_BRANCH_OVERRIDE).toEqual("PARENT_TEST");
      expect(props.TEST_PARAM_CHILD).toEqual("CHILD");
      expect(props.TEST_PARAM_CHILD_BRANCH_OVERRIDE).toEqual("CHILD_TEST");
      expect(props.TEST_PARAM_CHILD_LOCAL_OVERRIDE).toEqual("LOCAL_CHILD_TEST");
    }
  }

  class TestStack2 {
    constructor(appParam: core.Construct, stackName: string, props: TestStactProps) {
      expect(appParam).toEqual(app);
      expect(stackName).toEqual("Test Stack 2");
      expect(props.paramEnvId).toEqual("test");
      expect(props.description).toBeUndefined();

      expect(props.GIT_BRANCH).toEqual("test");
      expect(props.ENV_PARAM).toEqual("NOT_WRITABLE");

      if (props.env) {
        expect(props.env.account).toEqual("OTHER_ACCOUNT");
        expect(props.env.region).toEqual("OTHER_REGION");
      } else {
        throw "props.env should not be null";
      }

      expect(props.TEST_PARAM_PARENT).toEqual("PARENT");
      expect(props.TEST_PARAM_BRANCH_OVERRIDE).toEqual("PARENT_TEST");
    }
  }

  process.env.ENV_PARAM = "NOT_WRITABLE";

  await withInfraProperties({
    app: app,
    stackName: "Test Stack 1",
    stack: TestStack1,
    path: "./child",
    stackProps: {
      description: "Description"
    }
  });

  await withInfraProperties({
    app: app,
    stackName: "Test Stack 2",
    stack: TestStack2,
    path: "./child2"
  });
});
