import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productList from './products.json';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  return {
    statusCode: 200,
    // todo: need to do it here because  httpApi: {
    //   cors: true
    // }, is not working
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify(productList)
  }
};

export const main = middyfy(getProductsList);
