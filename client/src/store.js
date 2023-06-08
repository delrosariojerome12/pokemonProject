import {configureStore} from "@reduxjs/toolkit";
import pokedexReducer from "./features/pokedexReducer";
export const store = configureStore({
  reducer: {pokedex: pokedexReducer},
});
