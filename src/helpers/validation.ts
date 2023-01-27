import { Request } from '@google-cloud/functions-framework';
import { validate, validateSync, ValidatorOptions, ValidationError as ValidationErrorCv } from 'class-validator';
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

function _recursiveChildValidationErrors(property: string, child: ValidationErrorCv): string[] {
  const msgs = Object.values(child.constraints || {})
    .map(v => `${property}/${v}`)
    .flat();

  if (child.children) {
    const childMsgs = child.children.map(c => _recursiveChildValidationErrors(`${property}/${child.property}`, c)).flat();
    return msgs.concat(childMsgs);
  }

  return msgs;
}

function _throwIfValidationErrors(validationErrs: ValidationErrorCv[]): void {
  if (validationErrs.length > 0) {
    const msgs = validationErrs.map(ve => Object.values(ve.constraints || {})).flat();

    const childMsgs = validationErrs.reduce<string[]>((msgs, ve) => {
      if (ve.children) {
        const newMsgs = ve.children.map(child => _recursiveChildValidationErrors(ve.property, child)).flat();
        return msgs.concat(newMsgs);
      }
      return msgs;
    }, []);

    throw new ValidationError(msgs.concat(childMsgs));
  }
}

/**
 * Validates the supplied object.
 *
 * @param o the object to be validated
 * @throws ValidationError if the validation fails
 */
export async function validateOrThrow(o: object, validatorOptions?: ValidatorOptions): Promise<void> {
  const validationErrs = await validate(o, validatorOptions);
  _throwIfValidationErrors(validationErrs);
}

/**
 * Validates the supplied object.
 *
 * @param o the object to be validated
 * @throws ValidationError if the validation fails
 */
export function validateSyncOrThrow(o: object, validatorOptions?: ValidatorOptions): void {
  const validationErrs = validateSync(o, validatorOptions);
  _throwIfValidationErrors(validationErrs);
}
