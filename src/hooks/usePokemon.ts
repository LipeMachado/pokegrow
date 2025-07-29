import { useContext } from "react";
import { PokemonContext } from "../contexts/PokemonContextTypes";

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error("usePokemon deve ser usado dentro de um PokemonProvider");
  }
  return context;
}
