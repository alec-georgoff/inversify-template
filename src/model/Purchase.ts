import { injectable } from "inversify";
import { Model } from "objection";
import { z } from "zod";
import BaseModel from "./BaseModel";
import schema from "../schema/purchaseSchema";
// A dependency cycle should not happen because of the way the class is registered in the container
// eslint-disable-next-line import/no-cycle
import Customer from "./Customer";

// Note that as of TypeScript 4.9, classes can extend interfaces, but not types.
// This rule is okay to disable because all we're doing is making an interface from a type.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Purchase extends z.infer<typeof schema> {}
@injectable()
class Purchase extends BaseModel {
  constructor() {
    super(schema);
  }

  static get tableName() {
    return "purchases";
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      Customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "purchases.customerId",
          to: "customers.id",
        },
      },
    };
  }
}

export default Purchase;
