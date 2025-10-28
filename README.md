# Storefront Backend Project

This is a RESTful API for an online product store built mainly with Node.js, Express, and PostgreSQL.

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=my_store
POSTGRES_PORT=5433
POSTGRES_TEST_DB=test_store
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
ENV=dev
BCRYPT_PASSWORD={add-your-pepper-string}
SALT_ROUNDS=10
JWT_SECRET={add-your-jwt-secret}
```

### 3. Database Setup

**Start PostgreSQL with Docker:**

```bash
docker-compose up -d
```

**Run Database Migrations:**

```bash
npm run db:migrate
```

### 4. Start the Application

**Development Mode:**

```bash
npm start

**Production Mode:**

```bash
npm run build
```

### 4. Postman Collection

Added postman collection which can be imported to test the routes.
It can be found in the root directory.
Create a new environment variable in postman as follows: 
```bash
base_URL=localhost:3001
```

## Database Connection

The application connects to PostgreSQL using the following configuration:

- **Host:** 127.0.0.1
- **Port:** 5433
- **Database:** my_store
- **User:** postgres
- **Password:** postgres

The database runs in a Docker container. Make sure Docker is running before starting the application.

---

## Testing

Run the test suite:
Make sure the server is running and the database is up, then run:

```bash
npm test
```

Tests include:

- Model tests
- API endpoint tests

---

## API Documentation

For detailed API endpoint documentation, see [REQUIREMENTS.md](REQUIREMENTS.md).


License
---

MIT