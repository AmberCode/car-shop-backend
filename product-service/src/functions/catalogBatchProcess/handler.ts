import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@libs/models';
import { createProduct } from '@libs/productService';
import { validateSchema } from '@libs/schemaValidator';
import schema from '../../schema/createProduct';

const catalogBatchProcess = async (event) => {
  console.info("catalogBatchProcess\n" + JSON.stringify(event, null, 2))
  try {
    for (const record of event.Records) {
      const request = JSON.parse(record.body);
      const product: Product = {
        title: request.title,
        description: request.description,
        price: parseInt(request.price),
        count: parseInt(request.count),
      }

      console.log("product1", product);
      const checkSchema = validateSchema(schema, product);

      console.log('Product schema', checkSchema.success);

      if (!checkSchema.success) {
        return formatJSONResponse(400, {
          message: 'Failure to validate prod schema!',
          error: checkSchema.errors,
        });
      }
      
      await createProduct(product);
    }

    return formatJSONResponse(200, "");
  } catch (error) {
    console.log("Error", error);
    return formatJSONResponse(500, "Something went wrong");
  }
};

export const main = middyfy(catalogBatchProcess);
