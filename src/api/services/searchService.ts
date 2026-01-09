import { create, insertMultiple, search as oramaSearch } from "@orama/orama";
import { pluginQPS } from "@orama/plugin-qps";
import addresses from "src/api/data/adresses.json";
import { SEARCH_MIN_LENGTH, SEARCH_MAX_RESULTS } from "../../config/constants";

// Create and initialize Orama database
const db = create({
  schema: {
    postNumber: "string",
    city: "string",
    street: "string",
    typeCode: "number",
    type: "string",
    district: "string",
    municipalityNumber: "number",
    municipality: "string",
    county: "string",
  },
  plugins: [pluginQPS()],
});

await insertMultiple(
  db,
  addresses.map((a) => ({ ...a, postNumber: String(a.postNumber) }))
);

export async function search(searchString: string): Promise<typeof addresses> {
  if (searchString.length < SEARCH_MIN_LENGTH) return [];

  const results = await oramaSearch(db, {
    term: searchString,
    properties: ["street", "postNumber", "city"],
    limit: SEARCH_MAX_RESULTS,
  });

  console.log(results);

  return results.hits.map((hit) => ({
    ...hit.document,
    postNumber: parseInt(hit.document.postNumber),
  }));
}
