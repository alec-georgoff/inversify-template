import { injectable } from "inversify";
import Service from "../base-classes/Service";
import CustomersDAO from "../../dao/customers/CustomersDAO";
import Customer from "../../model/Customer";

@injectable()
class CustomersService extends Service<Customer> {
  constructor(protected readonly _customersDAO: CustomersDAO) {
    super(_customersDAO);
  }

  async assignGift(customerId: string) {
    const customer = await this._customersDAO.getCustomerWithPet(customerId);
    if (!customer) return null;
    console.log(`assigning to customer ${customer.id}...`);
    // pick pet randomly for gift
    const pets = customer.Pet;
    console.log(`they have these pets: ${pets}`);
    const pet = pets[Math.floor(Math.random()*pets.length)];
    console.log(`randomly selected pet: ${pet.species}`);
    // assign gift given date via DAO
    const result = await this._customersDAO.assignGiftToCustomer(customerId, `${pet.species}_gift`);
    // return pet type (as string for now)
    return result;
  }

  async getCustomersWithPetsAndGifts() {
    return await this._customersDAO.getCustomersWithPetsAndGifts();
  }
}

export default CustomersService;
