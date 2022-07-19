import { Client, ClientConfig } from 'pg';
import { Product } from './models';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions: ClientConfig = {
    host: PG_HOST,
    port: PG_PORT ? Number(PG_PORT) : 5432,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
}
const client = new Client(dbOptions);

export const getProducts = async (): Promise<Array<Product>> => {
    try {
        const query = `SELECT * 
            FROM "product" 
            LEFT JOIN "stock" ON "product"."id" = "stock"."product_id"`;
        await client.connect();
        const { rows } = await client.query(query);
        return rows.map((x) => {
            return {
                id: x.id,
                title: x.title,
                description: x.description,
                price: x.price,
                count: x.count,
            }
        })
    } catch (error) {
        console.error(error.stack);
        throw error;
    } finally {
        await client.end();
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    try {
        const query = `SELECT * 
            FROM "product" 
            LEFT JOIN "stock" ON "product"."id" = "stock"."product_id" 
            WHERE "product"."id" = ($1)::uuid`;
        await client.connect();
        const { rows } = await client.query(query, [id]);

        if (rows.length) {
            const row = rows[0];
            return {
                id: row.id,
                title: row.title,
                description: row.description,
                price: row.price,
                count: row.count,
            };
        }

        return undefined;
    } catch (error) {
        console.error(error.stack);
        throw error;
    } finally {
        await client.end();
    }
};


