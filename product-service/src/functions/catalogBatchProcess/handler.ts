import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const catalogBatchProcess = async (event) => {
  console.info("catalogBatchProcess\n" + JSON.stringify(event, null, 2))
  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));
    for (const product of products) {
      console.log('product obj', { product });
		}
    return formatJSONResponse(200, "");
  } catch (error) {
    console.log("Error", error);
    return formatJSONResponse(500, "Something went wrong");
  }  
};

export const main = middyfy(catalogBatchProcess);
