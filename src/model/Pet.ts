import { injectable } from "inversify";
import { Model } from "objection";
import { z } from "zod";
import BaseModel from "./BaseModel";
import schema from "../schema/petSchema";
// A dependency cycle should not happen because of the way the class is registered in the container
// eslint-disable-next-line import/no-cycle
import Customer from "./Customer";

// Note that as of TypeScript 4.9, classes can extend interfaces, but not types.
// This rule is okay to disable because all we're doing is making an interface from a type.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Pet extends z.infer<typeof schema> {}

@injectable()
class Pet extends BaseModel {
  constructor() {
    super(schema);
  }

  static get tableName() {
    return "pets";
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      Owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "pets.ownerId",
          to: "customers.id",
        },
      },
    };
  }
}

export default Pet;
