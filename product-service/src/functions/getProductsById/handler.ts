import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productList from './../getProductsList/products.json';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    if (!event.pathParameters || !event.pathParameters["productId"]) {
      return formatJSONResponse(400, 'Missing productId');
    }

    const { productId } = event.pathParameters;
    const product = productList.find(x => x.id === productId);

    if (product) {
      return formatJSONResponse(200, product);
    }

    return formatJSONResponse(404, "");
  } catch (error) {
    console.log(error);
    return formatJSONResponse(500, "Something went wrong");
  }
};

export const main = middyfy(getProductsById);
