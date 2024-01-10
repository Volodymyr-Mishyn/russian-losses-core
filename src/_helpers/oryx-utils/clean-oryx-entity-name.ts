/**
 * @deprecated
 */
export function cleanOryxEntityName(name: string): string | null {
  if (/unknown/i.test(name)) {
    return null;
  }
  const cleanedName = name
    .replace(/\bobr\.?\s?\d{4}\b/gi, '') // Remove 'obr' and the year
    .replace(/\bzr\.?\s?\d{4}\b/gi, '') // Remove 'obr' and the year
    .replace(/\d+-mm\b/gi, '') // Remove calibre mentions
    .replace(/['"]/g, '') // Remove quotes
    .replace(/\(.+?\)/g, '') // Remove anything inside parentheses
    .replace(/\bwith\b.*$/gi, '') // Remove everything after '***'
    .replace(/\bfor\b.*$/gi, '')
    .replace(/\bcommand and\b.*$/gi, '')
    .replace(/\barmoured recovery\b.*$/gi, '')
    .replace(/\btanker\b.*$/gi, '')
    .trim();
  return cleanedName || null;
}

export function cleanOryxEntityNameSimple(name: string): string | null {
  if (/unknown/i.test(name)) {
    return null;
  }
  const cleanedName = name
    .replace(/['"]/g, '') // Remove quotes
    .replace(/\(.+?\)/g, '') // Remove anything inside parentheses
    .trim();
  return cleanedName || null;
}

export function cleanOryxEntityNames(names: string[]): (string | null)[] {
  return names.map(cleanOryxEntityNameSimple);
}
