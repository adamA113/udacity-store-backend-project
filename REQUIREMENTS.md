# API Requirements
This file explain the API endpoints, database schema, and data shapes for the Storefront Backend API.

## API Endpoints
### Users

| HTTP Method  | Route          | Description          | Authentication     |
| ----------   | -------------- | -------------------- | -------------------|
| **POST**     | `/users/create`| Create a new user    | None               |
| **GET**      | `/users`       | Get all users        | None               |
| **GET**      | `/users/:id`   | Get user by ID       | None               |
| **PUT**      | `/users/:id`   | Update a user by ID  | **Token Required** |  
| **DELETE**   | `/users/:id`   | Delete user by ID    | **Token Required** |

### Products

| HTTP Method | Route                          | Description                     | Authentication      |
| ---------   | ------------------------------ | ------------------------------- | ------------------  |
| **POST**    | `/products/create`             | Create a new product            | **Token Required**  |
| **GET**     | `/products`                    | Get all products                | None                |
| **GET**     | `/products/:id`                | Get product by ID               | None                |
| **PUT**     | `/products/:id`                | Update product by ID            | **Token Required**  |
| **DELETE**  | `/products/:id`                | Delete product by ID            | **Token Required**  |

### Orders

| HTTP Method  | Route                          | Description                    | Authentication     |
| ---------    | ------------------------------ | -----------------------------  | ------------------ |
| **GET**      | `/orders/current/:user_id`     | Get current order for user     | **Token Required** |
| **POST**     | `/orders/create`               | Create a new order             | None               |
| **GET**      | `/orders`                      | Get all orders                 | **Token Required** |
| **GET**      | `/orders/:id`                  | Get order by ID                | **Token Required** |
| **PUT**      | `/orders/:id`                  | Update a order by ID           | **Token Required** |  
| **DELETE**   | `/orders/:id`                  | Delete order by ID             | **Token Required** |

---
## Database Schema

### Table: users

| Column        | Data Type | Constraints |
| ------------- | --------- | ----------- |
| **id**        | SERIAL    | PRIMARY KEY |
| **firstname** | VARCHAR   | NOT NULL    |
| **lastname**  | VARCHAR   | NOT NULL    |
| **password**  | VARCHAR   | NOT NULL    |

### Table: products

| Column       | Data Type | Constraints |
| ------------ | --------- | ----------- |
| **id**       | SERIAL    | PRIMARY KEY |
| **name**     | VARCHAR   | NOT NULL    |
| **price**    | DECIMAL   | NOT NULL    |
| **category** | VARCHAR   | NOT NULL    |

### Table: orders

| Column      | Data Type | Constraints                      |
| ----------- | --------- | -------------------------------- |
| **id**      | SERIAL    | PRIMARY KEY                      |
| **user_id** | INTEGER   | FOREIGN KEY REFERENCES users(id) |
| **status**  | BOOLEAN   | NOT NULL                         |

_Note: status = true means active order, status = false means completed order_

### Table: products_orders (Join Table)

| Column         | Data Type | Constraints                         |
| -------------- | --------- | ----------------------------------- |
| **order_id**   | INTEGER   | FOREIGN KEY REFERENCES orders(id)   |
| **product_id** | INTEGER   | FOREIGN KEY REFERENCES products(id) |
| **quantity**   | INTEGER   | NOT NULL                            |
|                |           | PRIMARY KEY (order_id, product_id)  |

---

## Data Schema
### User Schema

```typescript
type User = {
  id: number;
  firstname: string;
  lastname: string;
  password: string;
};
```

### Product Schema

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};
```

### Order Schema

```typescript
type Order = {
  id: number;
  user_id: number;
  status: boolean;
};
```

### Product in Order Schema

```typescript
type ProductInOrder = {
  order_id: number;
  product_id: number;
  quantity: number;
};
```

---

## Authentication

Routes marked with **Token Required** need a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are generated upon creating a new user via `POST /users/create` API endpoint.