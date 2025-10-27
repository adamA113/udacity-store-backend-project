/* Replace with your SQL commands */
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status BOOLEAN,
    user_id INT REFERENCES users(id)
);