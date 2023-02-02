import { Model, ModelOptions, QueryContext } from "objection";
import { z } from "zod";

class BaseModel extends Model {
  static ModelSchema: z.AnyZodObject;

  constructor(schema: z.AnyZodObject) {
    super();
    BaseModel.ModelSchema = schema;
  }

  private customValidate(): void {
    const value = BaseModel.ModelSchema.parse(this);
    Object.keys(this).forEach((key: string) => {
      delete this[key as keyof this];
    });
    Object.assign(this, value);
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.customValidate();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.customValidate();
  }
}

export default BaseModel;
