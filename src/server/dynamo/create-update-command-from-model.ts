import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export type ModelKeyLookup<Model> = {
  [k in keyof Model]: string;
};
export function createUpdateCommandFromModel<Model>({
  model,
  tableName,
  key,
  lookUp: columnNameLookup,
}: {
  model: Model;
  tableName: string;
  key: { pk: string; sk: string };
  lookUp: ModelKeyLookup<Model>;
}): UpdateCommand {
  const ea: Array<{
    columnName: string;
    expressionAttributeName: string;
    expressionAttribute: string;
    value: unknown;
  }> = [];

  for (const key in model) {
    if (Object.prototype.hasOwnProperty.call(model, key)) {
      const element = model[key];
      if (element !== undefined) {
        const columnName = columnNameLookup[key];
        ea.push({
          columnName,
          expressionAttributeName: `#${columnName}`,
          expressionAttribute: `:${columnName}`,
          value: element,
        });
      }
    }
  }
  return new UpdateCommand({
    Key: key,
    TableName: tableName,
    UpdateExpression: `set ${ea.map(({ expressionAttributeName, expressionAttribute }) => `${expressionAttributeName}=${expressionAttribute}`).join(", ")}`,
    ExpressionAttributeValues: ea.reduce(
      (agg, attribute) => {
        agg[attribute.expressionAttribute] = attribute.value;
        return agg;
      },
      {} as { [key: string]: unknown },
    ),
    ExpressionAttributeNames: ea.reduce(
      (agg, attribute) => {
        agg[attribute.expressionAttributeName] = attribute.columnName;
        return agg;
      },
      {} as { [key: string]: string },
    ),
  });
}
