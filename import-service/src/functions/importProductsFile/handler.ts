import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";

const S3 = new AWS.S3({ region: process.env.BUCKET_REGION, signatureVersion: 'v4', });

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  console.info("importProductsFile\n" + JSON.stringify(event, null, 2))
  try {
    const fileName = event.queryStringParameters.name;
    if (!fileName) {
      return formatJSONResponse(
        400, "Name is missing"
      );
    }

    const filePath = `uploaded/${fileName}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filePath,
      Expires: 360,
      ContentType: "text/csv",
    };
    const result = await S3.getSignedUrlPromise("putObject", params)
    return formatJSONResponse(200, result);
  } catch (error) {
    console.log("Error", error);
    return formatJSONResponse(500, "Something went wrong");
  }  
};

export const main = middyfy(importProductsFile);
