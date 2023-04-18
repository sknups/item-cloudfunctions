import { StatusCodes } from 'http-status-codes';

export function validateString(prop: string, template: any, requestHandler: (body: any) => any, optional: boolean = false) {
  it(`empty ${prop} returns 400 BAD_REQUEST`, async () => {
    const body = { ...template };
    body[prop] = '';
    const res = await requestHandler(body);

    expect(res.dto.message).toContain(`${prop} should not be empty`);
    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it(`numeric ${prop} returns 400 BAD_REQUEST`, async () => {
    const body = { ...template };
    body[prop] = 1;
    const res = await requestHandler(body);

    expect(res.dto.message).toContain(`${prop} must be a string`);
    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  if (!optional) {
    it('missing user returns 400 BAD_REQUEST', async () => {
      const body = { ...template };
      delete body[prop];
      const res = await requestHandler(body);

      expect(res.dto.message).toContain(`${prop} should not be empty`);
      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });
  }
}
