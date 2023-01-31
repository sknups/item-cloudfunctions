import 'reflect-metadata';
import { plainToClass, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { validateSyncOrThrow, ValidationError } from '../../src/helpers/validation';

class TestNestedNestedObject {
  @IsString()
  @IsNotEmpty()
  prop2?: string;

  @IsNumber()
  @IsNotEmpty()
  prop3?: number;
}

class TestNestedObject {
  @IsString()
  @IsNotEmpty()
  prop1?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TestNestedNestedObject)
  nestedNested?: TestNestedNestedObject
}

class TestObject {
  @IsString()
  @IsNotEmpty()
  a?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TestNestedObject)
  nested?: TestNestedObject

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TestNestedObject)
  nestedArr1?: TestNestedObject[]

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TestNestedObject)
  nestedArr2?: TestNestedObject[]
}

describe('validation helper', () => {

  it('maps validation errors into flat array of messages', () => {
    const invalidObject: TestObject = plainToClass(TestObject, {
      nested: {},
      nestedArr2: [
        {},
        { prop1: 'test' },
        { prop1: 'test11', prop2: 'test22' },
        {}
      ]
    });

    const expectedErrors: string[] = [
      'a should not be empty',
      'a must be a string',
      'nested/prop1 should not be empty',
      'nested/prop1 must be a string',
      'nested/nestedNested must be an object',
      'nestedArr1 should not be empty',
      'nestedArr1 must be an array',
      'nestedArr2/0/prop1 should not be empty',
      'nestedArr2/0/prop1 must be a string',
      'nestedArr2/0/nestedNested must be an object',
      'nestedArr2/1/nestedNested must be an object',
      'nestedArr2/2/nestedNested must be an object',
      'nestedArr2/3/prop1 should not be empty',
      'nestedArr2/3/prop1 must be a string',
      'nestedArr2/3/nestedNested must be an object'
    ];

    let caughtError: any;

    try {
      validateSyncOrThrow(invalidObject);
    } catch (e) {
      caughtError = e;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError).toBeInstanceOf(ValidationError);

    const validationError = caughtError as ValidationError;
    expect(validationError.errorMessages.sort()).toEqual(expectedErrors.sort());
  });

});
