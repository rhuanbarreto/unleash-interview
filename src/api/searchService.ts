import TrieSearch from "trie-search";
import addresses from "src/api/data/adresses.json";

const trie = new TrieSearch<(typeof addresses)[number]>(
  ["street", "postNumber", "city"],
  { min: 3, idFieldOrFunction: (i) => i.postNumber + i.city + i.typeCode }
);

trie.addAll(addresses);

export function search(searchString: string): (typeof addresses)[number][] {
  if (searchString.length < 3) return [];
  return trie.search(searchString);
}
