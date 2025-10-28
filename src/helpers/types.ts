export type User = {
    id?: number;
    firstname: string;
    lastname: string;
    password: string;
};

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};

export type Order = {
    id?: number;
    products?: [
        {
            product_id: number;
            quantity: number;
        }
    ];
    user_id: number;
    status: boolean;
};

export type ProductToOrder = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
}