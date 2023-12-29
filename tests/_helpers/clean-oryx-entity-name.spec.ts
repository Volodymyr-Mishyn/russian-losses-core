import { cleanOryxEntityName } from 'src/_helpers/oryx-utils/clean-oryx-entity-name';

describe('cleanOryxEntityName', () => {
  test('should return null for names with "unknown"', () => {
    expect(cleanOryxEntityName('Unknown T-72')).toBeNull();
    expect(cleanOryxEntityName('Unknown fuel tanker')).toBeNull();
  });

  test('should remove "obr." and the year', () => {
    expect(cleanOryxEntityName('T-62 Obr. 1967')).toBe('T-62');
    expect(cleanOryxEntityName('T-72B Obr. 1989')).toBe('T-72B');
  });

  test('should remove calibre mentions', () => {
    expect(cleanOryxEntityName('MT-LB with 82-mm automatic mortar 2B9 Vasilek')).toBe('MT-LB');
  });

  test('should remove quotes', () => {
    expect(cleanOryxEntityName('T-72 "Ural"')).toBe('T-72 Ural');
  });

  test('should remove content inside parentheses', () => {
    expect(cleanOryxEntityName('BMP-1(P)')).toBe('BMP-1');
  });

  test('should remove everything after "with"', () => {
    expect(cleanOryxEntityName('MT-LB with ZU-23 AA gun')).toBe('MT-LB');
  });

  test('should remove everything after "for"', () => {
    expect(cleanOryxEntityName('Command vehicle for Podlet-K1 low-altitude S-band surveillance radar')).toBe(
      'Command vehicle',
    );
  });

  test('should return the same name if no filters apply', () => {
    expect(cleanOryxEntityName('BMP-2 675-sb3KDZ')).toBe('BMP-2 675-sb3KDZ');
    expect(cleanOryxEntityName('T-90A')).toBe('T-90A');
    expect(cleanOryxEntityName('Mi-28 attack helicopter')).toBe('Mi-28 attack helicopter');
  });
});
