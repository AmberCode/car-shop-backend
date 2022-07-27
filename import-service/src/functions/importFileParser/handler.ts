import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import csv from 'csv-parser'

const S3 = new AWS.S3({ region: process.env.BUCKET_REGION });

const importFileParser = async (event) => {
  console.info("importFileParser\n" + JSON.stringify(event, null, 2))
  try {   
    for (const record of event.Records) {
        const key = record.s3.object.key;
        const s3Stream = S3.getObject({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        }).createReadStream();

        const parse = new Promise<void>((resolve, reject) => {
            s3Stream
              .pipe(csv())
              .on("open", () => console.log(`Parsing began: ${key}`))
              .on('data', (data) => console.log(`Parsed data: ${JSON.stringify(data)}`))
              .on('error', (err) => reject(`Error: ${err}`))
              .on('end', async () => {
                console.log(`copy from ${process.env.BUCKET_NAME}/${key}`)

                await S3.copyObject({
                    Bucket: process.env.BUCKET_NAME,
                    CopySource: `${process.env.BUCKET_NAME}/${key}`,
                    Key: key.replace('uploaded', 'parsed'),
                }).promise()

                console.log(`copied into ${process.env.BUCKET_NAME}/${key.replace('uploaded', 'parsed')}`)

                await S3.deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: key,
                }).promise();

                console.log(`file deleted from ${process.env.BUCKET_NAME}/${key}`);
                resolve();
              });
          });

        await parse;
    }

    return formatJSONResponse(200, "");
  } catch (error) {
    console.log("Error", error);
    return formatJSONResponse(500, "Something went wrong");
  }  
};

export const main = middyfy(importFileParser);
