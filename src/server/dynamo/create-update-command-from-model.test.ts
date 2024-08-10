import { describe, expect, it } from "vitest";
import { createUpdateCommandFromModel } from "./create-update-command-from-model";

describe("Create update from model", () => {
  type FakeModel = {
    prop1: string;
    prop2: number;
    prop3: Array<string>;
  };
  it("should create an update command", () => {
    const command = createUpdateCommandFromModel<FakeModel>({
      model: {
        prop1: "cat",
        prop2: 1234,
        prop3: ["fish", "sticks"],
      },
      key: {
        pk: "pk-key",
        sk: "sk-key",
      },
      tableName: "TheTableName",
      lookUp: {
        prop1: "col-prop1",
        prop2: "col-prop2",
        prop3: "col-prop3",
      },
    });
    expect(command.input).toEqual({
      ExpressionAttributeNames: {
        "#col-prop1": "col-prop1",
        "#col-prop2": "col-prop2",
        "#col-prop3": "col-prop3",
      },
      ExpressionAttributeValues: {
        ":col-prop1": "cat",
        ":col-prop2": 1234,
        ":col-prop3": ["fish", "sticks"],
      },
      Key: {
        pk: "pk-key",
        sk: "sk-key",
      },
      TableName: "TheTableName",
      UpdateExpression:
        "set #col-prop1=:col-prop1, #col-prop2=:col-prop2, #col-prop3=:col-prop3",
    });
  });
});
