import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@libs/models';
import { createProduct } from '../../libs/productService';
import schema from './schema';
import { validateSchema } from '@libs/schemaValidator';

const createProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('request', event.body);
  try {
    const request = { ...event.body };
    const checkSchema = validateSchema(schema, request);

    if (!checkSchema.success) {
      return formatJSONResponse(400, {
        message: 'Failure to validate schema!',
        error: checkSchema.errors,
      });
    }

    await createProduct(request as Product);
    return formatJSONResponse(201, 'OK');
  } catch (error) {
    console.log(error);
    return formatJSONResponse(500, "Something went wrong");
  }
};

export const main = middyfy(createProductHandler);
