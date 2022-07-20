import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@libs/models';
import { createProduct } from '../../libs/productService';
import schema from './schema';

const createProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('createProduct body', event.body);
  try {
    const request = { ...event.body };
    await createProduct(request as Product);
    return formatJSONResponse(201, 'OK');
  } catch (error) {
    console.log(error);
    return formatJSONResponse(500, "Something went wrong");
  }
};

export const main = middyfy(createProductHandler);
