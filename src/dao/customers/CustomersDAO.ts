import { inject, injectable } from "inversify";
import Customer from "../../model/Customer";
import Gift from "../../model/Gift";
import Pet from "../../model/Pet";
import Purchase from "../../model/Purchase";
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
    console.log(`attempting query for customer ${id}...`);
    const result = await this.model.query()
      .findById(id)
      .withGraphFetched('Pet')
      .withGraphFetched('Gift')
      .withGraphFetched('Purchase');
    console.log(result);
    return result as Customer & { Pet: Pet[], Purchase: Purchase[], Gift: Gift | undefined }; // update typing?
  }

  async assignGiftToCustomer(id: string, giftType: string) {
    const customer = await this.model.query().findById(id);
    if (!customer) return null;
    const result = await customer.$relatedQuery('Gift').insert({ type: giftType });
    return result;
  }

  async getCustomersWithPetsAndGifts() {
    const result = await this.model.query().withGraphFetched('Pet').withGraphFetched('Gift');
    console.log(result);
    return result;
  }
}

export default CustomersDAO;
