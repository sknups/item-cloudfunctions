import "reflect-metadata";
import { parseMedia } from '../../src/mapper/item-media-json-parser';

function _media(overrides: any = {}): any {
  const media = {
    primary: {
      type: 'STATIC'
    },
    secondary: [
      {
        type: 'DYNAMIC',
        link: 'test',
        labels: [
          {
            a: 'test',
            b: 'testb',
          },
          {
            c: 'testc',
          }
        ]
      },
      {
        type: 'VIDEO'
      }
    ]
  };
  return {
    ...media,
    ...overrides,
  }
}

describe('mapper - item media json parser', () => {

  it('returns null for null argument', () => {
    const result = parseMedia(null);

    expect(result).toEqual(null);
  });

  it('missing primary returns error', () => {
    const media = _media();
    delete media.primary;

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('primary must be an object');
  });

  it('missing primary type returns error', () => {
    const media = _media({ primary: {} });

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('primary/type must be one of the following values');
  });

  it('invalid primary type returns error', () => {
    const media = _media({ primary: { type: 'INVALID' } });

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('primary/type must be one of the following values');
  });

  it('missing primary labels returns error for DYNAMIC', async () => {
    const media = _media({
      primary: {
        type: 'DYNAMIC',
      }
    });

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('primary/labels must be an array');
  });

  it('missing secondary returns error', () => {
    const media = _media();
    delete media.secondary;

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('secondary must be an array');
  });

  it('missing secondary type returns error', () => {
    const media = _media({ secondary: [{}] });

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('secondary/0/type must be one of the following values');
  });

  it('invalid secondary type returns error', () => {
    const media = _media({ secondary: [{ type: 'INVALID' }] })

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('secondary/0/type must be one of the following values');
  });

  it('missing secondary labels returns error for DYNAMIC', async () => {
    const media = _media();
    delete media.secondary[0].labels;

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('secondary/0/labels must be an array');
  });

  it('missing three type returns error', () => {
    const media = _media({ three: {} })

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('three/type must be one of the following values');
  });

  it('invalid three type returns error', () => {
    const media = _media({ three: { type: 'INVALID' } })

    expect(() => parseMedia(JSON.stringify(media)))
      .toThrow('three/type must be one of the following values');
  });

  it('extra property is allowed', () => {
    const media = _media({
      primary: {
        type: 'STATIC',
        extra: 'hello',
      }
    });

    const result = parseMedia(JSON.stringify(media));
    expect(result?.secondary).toHaveLength(2);
  });

  it('secondary size 0 is allowed', () => {
    const media = _media({ secondary: [] });

    const result = parseMedia(JSON.stringify(media));
    expect(result?.secondary).toHaveLength(0);
  });

  it('valid JSON returns object', () => {
    const media = _media();

    const result = parseMedia(JSON.stringify(media));
    expect(result?.primary.type).toEqual('STATIC');
    expect(result?.secondary).toHaveLength(2);
    expect(result?.secondary[0].type).toEqual('DYNAMIC');
    expect(result?.secondary[0].link).toEqual('test');
    expect(result?.secondary[1].type).toEqual('VIDEO');
    expect(result?.secondary[1].link).toEqual(undefined);
  });

  it('valid JSON with media.three returns object', () => {
    const media = _media({ three: { type: 'NONE' } });

    const result = parseMedia(JSON.stringify(media));
    expect(result?.three?.type).toEqual('NONE');
  });

});
