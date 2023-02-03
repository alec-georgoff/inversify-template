import chai from "chai";
import sinon, { SinonStubbedInstance } from "sinon";
import CustomersDAO from "../../../dao/customers/CustomersDAO";
import CustomersService from "../CustomersService";
import { v4 as uuidv4 } from 'uuid';
import Customer from "../../../model/Customer";
import { Model, QueryBuilder } from "objection";
import Pet from "../../../model/Pet";
import Gift from "../../../model/Gift";
import Purchase from "../../../model/Purchase";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("src :: service :: customers :: CustomersService", () => {
    class SubclassService extends CustomersService {}
    let subclassService: CustomersService;

    let dao: SinonStubbedInstance<CustomersDAO>;
    let customer: Customer;
    let gift: Gift;
    let oldPurchaseDate: Date;
    let recentPurchaseDate: Date;
    let oldPurchase: Purchase;
    let recentPurchase: Purchase;
    let pet: Pet;

    beforeEach(() => {
        dao = sandbox.createStubInstance(CustomersDAO);
        subclassService = new SubclassService(dao);
        
        // prepare customer
        customer = new Customer();
        const id = uuidv4();
        customer.id = id;

        // prepare pet
        pet = new Pet();
        pet.species = 'dog';

        // prepare purchases
        oldPurchaseDate = new Date(2020, 0, 1);
        oldPurchase = new Purchase();
        oldPurchase.date = oldPurchaseDate;

        recentPurchaseDate = new Date();
        recentPurchaseDate.setMonth(recentPurchaseDate.getMonth() - 1);
        recentPurchase = new Purchase();
        recentPurchase.date = recentPurchaseDate;

        // prepare gift
        gift = new Gift();
        gift.type = 'dog_gift';
    });

    afterEach(() => {
        sandbox.restore();
        sandbox.reset();
    });

    describe("# assignGift", () => {
        context("when there is no customer with given id", () => {
            it("assignGift returns null", async () => {
                // arrange
                dao.getFullCustomer.resolves(undefined);
                const newId = uuidv4();
                // act
                const result = await subclassService.assignGift(newId);
                // assert
                sandbox.assert.calledOnce(dao.getFullCustomer);
                expect(result).to.deep.equal(null);
            });
        });

        context("when there is a customer with the given id", () => {
            context("when the customer already has a gift", () => {
                it("assignGift returns null", async () => {
                    // arrange
                    const queryResult = {...customer, Pet: [pet], Purchase: [oldPurchase], Gift: gift};
                    dao.getFullCustomer.resolves(queryResult as unknown as Customer & { Pet: Pet[], Purchase: Purchase[], Gift: Gift | undefined });
                    // act
                    const result = await subclassService.assignGift(customer.id);
                    // assert
                    sandbox.assert.calledOnce(dao.getFullCustomer);
                    sandbox.assert.calledWith(dao.getFullCustomer, customer.id);
                    expect(result).to.deep.equal(null);
                })
            });

            context("when the customer has no pets", () => {
                it("assignGift returns null", async () => {
                    // arrange
                    const queryResult = {...customer, Pet: [], Purchase: [oldPurchase], Gift: undefined};
                    dao.getFullCustomer.resolves(queryResult as unknown as Customer & { Pet: Pet[], Purchase: Purchase[], Gift: Gift | undefined });
                    // act
                    const result = await subclassService.assignGift(customer.id);
                    // assert
                    sandbox.assert.calledOnce(dao.getFullCustomer);
                    sandbox.assert.calledWith(dao.getFullCustomer, customer.id);
                    expect(result).to.deep.equal(null);
                })
            });

            context("when the customer has no purchases older than six months", () => {
                it("assignGift returns null", async () => {
                    // arrange
                    const queryResult = {...customer, Pet: [pet], Purchase: [recentPurchase], Gift: undefined};
                    dao.getFullCustomer.resolves(queryResult as unknown as Customer & { Pet: Pet[], Purchase: Purchase[], Gift: Gift | undefined });
                    // act
                    const result = await subclassService.assignGift(customer.id);
                    // assert
                    sandbox.assert.calledOnce(dao.getFullCustomer);
                    sandbox.assert.calledWith(dao.getFullCustomer, customer.id);
                    expect(result).to.deep.equal(null);
                })
            });

            context("when the customer is fully eligible for a gift", () => {
                it("assignGift returns a gift", async () => {
                    // arrange
                    const queryResult = {...customer, Pet: [pet], Purchase: [oldPurchase], Gift: undefined};
                    dao.getFullCustomer.resolves(queryResult as unknown as Customer & { Pet: Pet[], Purchase: Purchase[], Gift: Gift | undefined });
                    dao.assignGiftToCustomer.resolves(gift);
                    // act
                    const result = await subclassService.assignGift(customer.id);
                    // assert
                    sandbox.assert.calledOnce(dao.getFullCustomer);
                    sandbox.assert.calledWith(dao.getFullCustomer, customer.id);
                    sandbox.assert.calledOnce(dao.assignGiftToCustomer);
                    sandbox.assert.calledWith(dao.assignGiftToCustomer, customer.id, gift.type);
                    expect(result).to.not.be.null;
                    expect(result?.type).to.equal(gift.type);
                })
            });
        })
    });
})