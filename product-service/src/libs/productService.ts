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


export const getProducts = async (): Promise<Array<Product>> => {
    const query = `SELECT * 
    FROM "product" 
    LEFT JOIN "stock" ON "product"."id" = "stock"."product_id"`;
    
    const client = new Client(dbOptions);

    try {
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
        try {
            await client.end();
        } catch (error) {
            console.log('Error on client.end', error);
        }
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    const query = `SELECT * 
        FROM "product" 
        LEFT JOIN "stock" ON "product"."id" = "stock"."product_id" 
        WHERE "product"."id" = ($1)::uuid`;

    const client = new Client(dbOptions);

    try {
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
        try {
            await client.end();
        } catch (error) {
            console.log('Error on client.end', error);
        }
    }
};

export const createProduct = async (product: Product): Promise<void> => {
    const createProductQuery = `INSERT INTO "product" ("title", "description", "price")  
        VALUES ($1, $2, $3) RETURNING id`;
    const createProductValues = [product.title, product.description, product.price];
    const createStockQuery = `INSERT INTO "stock" ("product_id", "count") 
        VALUES ($1, $2)`;
   
    const client = new Client(dbOptions);

    try {
        await client.connect();
        await client.query("BEGIN");
        const result = await client.query(createProductQuery, createProductValues);
        const createStockValues = [result.rows[0].id, product.count];
        await client.query(createStockQuery, createStockValues);
        await client.query("COMMIT");
    } catch (error) {
        console.error(error.stack);
        await client.query("ROLLBACK");
        throw error;
    } finally {
        try {
            await client.end();
        } catch (error) {
            console.log('Error on client.end', error);
        }
    }
};


