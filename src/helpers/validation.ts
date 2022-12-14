import { Request } from '@google-cloud/functions-framework';
import { validate, ValidatorOptions } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';

export class ValidationError extends Error {
  constructor(public readonly errorMessages: string[]) {
    super(`Validation error: ${JSON.stringify(errorMessages)}`);
  }
}

/**
 * Parses the request body and performs validation.
 * 
 * @param dtoType a reference to the DTO constructor used to parse and validate
 * @param req the request object used to read the raw request data
 * @returns the parsed, transformed and validated object
 * @throws ValidationError if the validation fails
 */
export async function parseAndValidateRequestData<T extends object>(dtoType: ClassConstructor<T>, req: Request): Promise<T | null> {
  const requestObject: T = plainToClass(dtoType, req.body);
  await validateOrThrow(requestObject);
  return requestObject;
}

/**
 * Validates the supplied object.
 *
 * @param o the object to be validated
 * @throws ValidationError if the validation fails
 */
export async function validateOrThrow(o: object, validatorOptions?: ValidatorOptions): Promise<void> {
  const validationErrs = await validate(o, validatorOptions);
  if (validationErrs.length > 0) {
    const msgs = validationErrs.map(ve => Object.values(ve.constraints || {})).flat(); // TODO map children
    throw new ValidationError(msgs);
  }
}
