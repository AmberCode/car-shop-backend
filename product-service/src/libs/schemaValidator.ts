import Ajv, { ErrorObject, Schema } from 'ajv';
import type { FromSchema } from 'json-schema-to-ts';

interface ValidationResult {
  success: boolean,
  errors: ErrorObject[] | null | undefined
}

export const validateSchema = (schema:Schema, data:object): ValidationResult => {
    type SchemaToValidate = FromSchema<typeof schema>;
    const dataToTest: SchemaToValidate = data;
    const validate = new Ajv({ useDefaults: true }).compile(schema);

    const returnResult: ValidationResult = {
      success: validate(dataToTest),
      errors: validate.errors,
    };

    return returnResult;
};