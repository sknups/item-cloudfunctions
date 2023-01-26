import { parseMedia } from '../../src/mapper/item-media-json-parser';

const MEDIA: any = {
  primary: {
    type: 'STATIC'
  },
  secondary: [
    {
      type: 'DYNAMIC',
      link: 'test'
    },
    {
      type: 'VIDEO'
    }
  ]
};

describe('mapper - item media json parser', () => {

  it('returns null for null argument', async () => {
    const result = await parseMedia(null);

    expect(result).toEqual(null);
  });

  it('missing primary returns error', async () => {
    const media = { ...MEDIA };
    delete media.primary;

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('primary must be an object');
  });

  it('missing primary type returns error', async () => {
    expect(() => parseMedia(JSON.stringify({ ...MEDIA, primary: {} })))
      .toThrow('primary/type must be one of the following values');
  });

  it('invalid primary type returns error', async () => {
    expect(() => parseMedia(JSON.stringify({ ...MEDIA, primary: { type: 'INVALID' } })))
      .toThrow('primary/type must be one of the following values');
  });

  it('missing secondary returns error', async () => {
    const media = { ...MEDIA };
    delete media.secondary;

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('secondary must be an array');
  });

  it('missing secondary type returns error', async () => {
    expect(() => parseMedia(JSON.stringify({ ...MEDIA, secondary: [{}] })))
      .toThrow('secondary/0/type must be one of the following values');
  });

  it('invalid secondary type returns error', async () => {
    expect(() => parseMedia(JSON.stringify({ ...MEDIA, secondary: [{ type: 'INVALID' }] })))
      .toThrow('secondary/0/type must be one of the following values');
  });

  it('extra property is allowed', async () => {
    const result = parseMedia(JSON.stringify({
      ...MEDIA,
      primary: {
        type: 'STATIC',
        extra: 'hello',
      }
    }));
    expect(result?.secondary).toHaveLength(2);
  });

  it('secondary size 0 is allowed', async () => {
    const result = parseMedia(JSON.stringify({ ...MEDIA, secondary: [] }));
    expect(result?.secondary).toHaveLength(0);
  });

  it('valid JSON returns object', async () => {
    const result = parseMedia(JSON.stringify(MEDIA));
    expect(result?.primary.type).toEqual('STATIC');
    expect(result?.secondary).toHaveLength(2);
    expect(result?.secondary[0].type).toEqual('DYNAMIC');
    expect(result?.secondary[0].link).toEqual('test');
    expect(result?.secondary[1].type).toEqual('VIDEO');
    expect(result?.secondary[1].link).toEqual(undefined);
  });

});
