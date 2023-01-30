# inversify-template

## Getting Started

### Background
This application follows the Layered Architecture design pattern. For more information, see this article for Java: https://medium.com/java-vault/layered-architecture-b2f4ebe8d587

### Prerequisites
Docker Desktop for Mac, Linux, or Windows: https://www.docker.com/products/docker-desktop/

### Installing
Execute the following command to install dependencies
``` 
yarn install
```

### Creating config files 
Use **development.json​.example** and **docker-compose.yml.example**​ as templates to create your own **development.json​** and **docker-compose.yml**

In your **development.json**, replace the placeholders in the following lines with your own fake values
```
3,5,6,7,8,9
```

In your **docker-compose.yml**, replace the placeholders in the following lines with your own fake values
```
12,48,55,56,57,63,65,66
```
Be careful to confirm that the port numbers and credentials in docker-compose.yml match the port numbers and credentials in development.json

For example: YOUR_DB_USER in line 8 of development.json should match YOUR_DB_USER in line 57 of docker-compose.yml

### Running the app
Build and run the Docker containers configured in your docker-compose.yml file
```
yarn docker
```

#### Confirm the container is running
Visit http://localhost:8080/api
if you deployed the container to a different port, replace 8080 with the port you used

## Working with the example use-case
### Configuring the example use-case
Check out the customer-example branch
```
git checkout customer-example
```

Install dependencies
```
yarn 
```
### Migrate and seed the database
```
NODE_ENV=development yarn migrate
NODE_ENV=development yarn seed
```
Visit http://localhost:8080/api/customers to confirm there is seeded data

### Run the tests
```
yarn test
```

### Using the ApiErrorHandler Express middleware
The ApiErrorHandler should only be used in the controller layer. 

It's invoked by calling next() with an instance of ApiError

Whenever you call next(), your function will continue executing until it reaches the next middleware function or the end of the function or a return statement
```
class CustomersController {
  constructor(private readonly _service: Service) {
    this.getById = this.getById.bind(this);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this._service.getById(id);
      if (!result) {
        next(ApiError.notFound(`Customer with id ${id} not found`));
        return;
      }
      return res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
      return;
    }
  }
}

```