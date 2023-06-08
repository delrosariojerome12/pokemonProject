import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  pokemonList: null,
  previousPage: null,
  currentPage: null,
  nextPage: null,
  isLoading: false,
  isError: false,
};

export const getPokemonOnload = createAsyncThunk(
  "/pokemon/onLoad",
  async ({x}, {rejectWithValue}) => {
    try {
      const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
      const {data: res} = await axios.get(url);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
);

export const pokedexReducer = createSlice({
  name: "pokedex-reducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPokemonOnload.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPokemonOnload.fulfilled, (state, action) => {
        const {results} = action.payload;
        state.isLoading = false;
        state.isError = false;
        state.pokemonList = results;
      })
      .addCase(getPokemonOnload.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {} = pokedexReducer.actions;

export default pokedexReducer.reducer;
