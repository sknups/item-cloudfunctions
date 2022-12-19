import { hashEmail } from "../../src/hashing";

describe('hashing - hash an email address', () => {

  it('hashes an email address', () => {
    const expected = '988de4d80fd8192ac4ada9a026383cc26cce1b859b39ff37b1814526470707b3'
    const result = hashEmail("user@example.com", "this is a secret")
    expect(result).toEqual(expected)
  });

  it('creates a different hashes for different email address', () => {
    const expected = '59f5841e11adb3d6f009adbd89cf58340fadd434e180cade2880829a391baf01'
    const result = hashEmail("user2@example.com", "this is a secret")
    expect(result).toEqual(expected)
  });

  it('creates a different hashes for different secret', () => {
    const expected = 'b9a1764cc6c7cd2f8a7247a779edef1f0299e8c0d8514aee2f028c3add7ae44e'
    const result = hashEmail("user2@example.com", "this is a different secret")
    expect(result).toEqual(expected)
  });

});
