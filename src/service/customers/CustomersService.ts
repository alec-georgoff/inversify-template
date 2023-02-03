import { injectable } from "inversify";
import Service from "../base-classes/Service";
import CustomersDAO from "../../dao/customers/CustomersDAO";
import Customer from "../../model/Customer";
import Gift from "../../model/Gift";

@injectable()
class CustomersService extends Service<Customer> {
  constructor(protected readonly _customersDAO: CustomersDAO) {
    super(_customersDAO);
  }

  async assignGift(customerId: string) {
    const customer = await this._customersDAO.getFullCustomer(customerId);
    if (!customer) return null;
    const customerHasGift = !!customer.Gift;
    const customerHasPets = customer.Pet.length > 0;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const customerIsEligible = customer.Purchase.some(p => p.date.getTime() < sixMonthsAgo.getTime());
    if (customerHasGift || !customerHasPets || !customerIsEligible) {
      return null;
    }
    const pets = customer.Pet;
    const pet = pets[Math.floor(Math.random()*pets.length)];
    const result = await this._customersDAO.assignGiftToCustomer(customerId, `${pet.species}_gift`);
    return result === null ? null : result as Gift;
  };
}

export default CustomersService;
