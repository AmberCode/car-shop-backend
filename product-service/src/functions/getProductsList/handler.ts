import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts } from '../../libs/productService';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  // console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
  console.info("EVENT\n" + JSON.stringify(event, null, 2))

  try {
    const products = await getProducts();
    return formatJSONResponse(200, products);
  } catch (error) {
    console.log("Error", error);
    return formatJSONResponse(500, "Something went wrong");
  }  
};

export const main = middyfy(getProductsList);
