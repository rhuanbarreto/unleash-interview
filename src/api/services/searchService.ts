import TrieSearch from "trie-search";
import addresses from "src/api/data/adresses.json";
import { SEARCH_MIN_LENGTH, SEARCH_MAX_RESULTS } from "../../config/constants";

const trie = new TrieSearch<(typeof addresses)[number]>(
  ["street", "postNumber", "city"],
  {
    min: SEARCH_MIN_LENGTH,
    idFieldOrFunction: (i) => i.postNumber + i.city + i.typeCode,
    ignoreCase: true,
  }
);

trie.addAll(addresses);

export function search(searchString: string): (typeof addresses)[number][] {
  if (searchString.length < SEARCH_MIN_LENGTH) return [];
  return (
    //FIXME: This type assertion is waiting for https://github.com/joshjung/trie-search/pull/57 to be removed.
    (
      trie.get(
        searchString,
        undefined,
        SEARCH_MAX_RESULTS
      ) as ((typeof addresses)[number] & {
        $tsid: string;
      })[]
    ).map((a) => {
      const { $tsid, ...rest } = a;
      return rest;
    })
  );
}
