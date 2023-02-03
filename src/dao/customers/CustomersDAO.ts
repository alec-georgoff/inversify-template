import { inject, injectable } from "inversify";
import Customer, { FullCustomer } from "../../model/Customer";
import DAO from "../base-classes/DAO";

@injectable()
class CustomersDAO extends DAO<Customer> {
  constructor(
    @inject("Customer")
    protected readonly _customer: typeof Customer,
  ) {
    super(_customer);
  }

  async getFullCustomer(id: string) {
    const result = await this.model.query()
      .findById(id)
      .withGraphFetched('Pet')
      .withGraphFetched('Gift')
      .withGraphFetched('Purchase');
    return result as FullCustomer;
  }

  async assignGiftToCustomer(id: string, giftType: string) {
    const customer = await this.model.query().findById(id);
    if (!customer) return null;
    const result = await customer.$relatedQuery('Gift').insert({ type: giftType });
    return result;
  }
}

export default CustomersDAO;
