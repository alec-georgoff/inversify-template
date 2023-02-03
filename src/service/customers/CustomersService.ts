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
      console.log(`customer has pets? ${customerHasPets}`);
      console.log(`${customerHasGift ? 'customer already has a gift' : 'no gift yet, but...'}`);
      console.log(`customer purchase date is ${customer.Purchase.map(p => p.date.toString())}`);
      return null;
    }
    console.log(`assigning to customer ${customer.id}...`);
    // pick pet randomly for gift
    const pets = customer.Pet;
    console.log(`they have these pets: ${pets}`);
    const pet = pets[Math.floor(Math.random()*pets.length)];
    console.log(`randomly selected pet: ${pet.species}`);
    // assign gift given date via DAO
    const result = await this._customersDAO.assignGiftToCustomer(customerId, `${pet.species}_gift`);
    // return pet type (as string for now)
    return result === null ? null : result as Gift;
  }

  async getCustomersWithPetsAndGifts() {
    return await this._customersDAO.getCustomersWithPetsAndGifts();
  }
}

export default CustomersService;
