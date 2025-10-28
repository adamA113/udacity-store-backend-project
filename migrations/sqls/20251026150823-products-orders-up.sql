/* Replace with your SQL commands */
CREATE TABLE products_orders (
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    PRIMARY KEY(product_id,order_id)
);