import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const searchTermAtom = atom("");
export const selectedTypesAtom = atom<string>("");
export const sortOrderAtom = atom<
  "name-asc" | "name-desc" | "power-asc" | "power-desc" | ""
>("power-asc");

export const showOnlyFavoritesAtom = atom(false);

export const currentPageAtom = atom(1);
export const itemsPerPageAtom = atom(18);

export const selectedPokemonIdAtom = atom<number | null>(null);
export const isModalOpenAtom = atom(false);

export const themeAtom = atomWithStorage<"light" | "dark">("theme", "dark");

export const favoritePokemonsAtom = atomWithStorage<number[]>("favorites", []);

export const searchParamsAtom = atom((get) => {
  const searchTerm = get(searchTermAtom);
  const selectedTypes = get(selectedTypesAtom);
  const sortOrder = get(sortOrderAtom);
  const currentPage = get(currentPageAtom);
  const itemsPerPage = get(itemsPerPageAtom);

  const offset = (currentPage - 1) * itemsPerPage;

  return {
    name: searchTerm,
    types: selectedTypes,
    sort: sortOrder,
    limit: itemsPerPage,
    offset: offset,
  };
});
