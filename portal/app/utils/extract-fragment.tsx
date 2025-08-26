export function extractFragmentFromUrl(url: string, key: string) {
  const hash = new URL(url).hash;
  const params = new URLSearchParams(hash.slice(1));
  return params.get(key);
}
