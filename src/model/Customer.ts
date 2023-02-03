import { injectable } from "inversify";
import { Model } from "objection";
import { z } from "zod";
import BaseModel from "./BaseModel";
import schema from "../schema/customerSchema";
// A dependency cycle should not happen because of the way the class is registered in the container
// eslint-disable-next-line import/no-cycle
import Pet from "./Pet";
// A dependency cycle should not happen because of the way the class is registered in the container
// eslint-disable-next-line import/no-cycle
import Purchase from "./Purchase";
import Gift from "./Gift";

// Note that as of TypeScript 4.9, classes can extend interfaces, but not types.
// This rule is okay to disable because all we're doing is making an interface from a type.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Customer extends z.infer<typeof schema> {}

@injectable()
class Customer extends BaseModel {
  constructor() {
    super(schema);
  }

  static get tableName() {
    return "customers";
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      Pet: {
        relation: Model.HasManyRelation,
        modelClass: Pet,
        join: {
          from: "customers.id",
          to: "pets.ownerId",
        },
      },

      Purchase: {
        relation: Model.HasManyRelation,
        modelClass: Purchase,
        join: {
          from: "customers.id",
          to: "purchases.customerId",
        },
      },

      Gift: {
        relation: Model.HasOneRelation,
        modelClass: Gift,
        join: {
          from: "customers.id",
          to: "gifts.customerId",
        },
      },
    };
  }
}

export default Customer;

export interface FullCustomer extends Customer {
  Pet: Pet[];
  Purchase: Purchase[];
  Gift: Gift | undefined;
}
