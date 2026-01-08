import TrieSearch from "trie-search";
import addresses from "src/api/data/adresses.json";

const trie = new TrieSearch<(typeof addresses)[number]>(
  ["street", "postNumber", "city"],
  {
    min: 3,
    idFieldOrFunction: (i) => i.postNumber + i.city + i.typeCode,
    ignoreCase: true,
  }
);

trie.addAll(addresses);

export function search(searchString: string): (typeof addresses)[number][] {
  if (searchString.length < 3) return [];
  return (
    //FIXME: This type assertion is waiting for https://github.com/joshjung/trie-search/pull/57 to be removed.
    (
      trie.get(searchString, undefined, 20) as ((typeof addresses)[number] & {
        $tsid: string;
      })[]
    ).map((a) => {
      const { $tsid, ...rest } = a;
      return rest;
    })
  );
}
