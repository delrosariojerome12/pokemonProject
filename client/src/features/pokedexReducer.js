import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  selectedPokemon: null,
  previousPokemon: null,
  nextPokemon: null,
  pokemonList: null,
  isLoading: false,
  isError: false,
};

export const getPokemonOnload = createAsyncThunk(
  "/pokemon/onLoad",
  async ({x}, {rejectWithValue}) => {
    try {
      const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
      const {data: res} = await axios.get(url);
      return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const handleNextPokemon = createAsyncThunk(
  "/pokemon/next",
  async ({x}, {rejectWithValue, getState}) => {
    const {
      pokedex: {nextPokemon},
    } = getState();
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${nextPokemon}/`;
      const data = (await axios.get(url)).data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const handlePreviousPokemon = createAsyncThunk(
  "/pokemon/previous",
  async ({x}, {rejectWithValue, getState}) => {
    const {
      pokedex: {previousPokemon},
    } = getState();
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${previousPokemon}/`;
      const data = (await axios.get(url)).data;
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const pokedexReducer = createSlice({
  name: "pokedex-reducer",
  initialState,
  reducers: {
    handleSelectPokemon: (state, action) => {
      const {id} = action.payload;
      state.selectedPokemon = action.payload;
      state.nextPokemon = id + 1;
      state.previousPokemon = id === 1 ? id : id - 1;
    },
  },
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
    // next
    builder
      .addCase(handleNextPokemon.pending, (state, action) => {
        // state.isLoading = true;
      })
      .addCase(handleNextPokemon.fulfilled, (state, action) => {
        const {id} = action.payload;
        // state.isLoading = false;
        // state.isError = false;
        state.selectedPokemon = action.payload;
        state.nextPokemon = id + 1;
        state.previousPokemon = id === 1 ? id : id - 1;
      })
      .addCase(handleNextPokemon.rejected, (state, action) => {
        // state.isLoading = false;
        // state.isError = true;
      });
    // previousPokemon
    builder
      .addCase(handlePreviousPokemon.pending, (state, action) => {
        // state.isLoading = true;
      })
      .addCase(handlePreviousPokemon.fulfilled, (state, action) => {
        const {id} = action.payload;
        // state.isLoading = false;
        // state.isError = false;
        state.selectedPokemon = action.payload;
        state.nextPokemon = id + 1;
        state.previousPokemon = id === 1 ? id : id - 1;
      })
      .addCase(handlePreviousPokemon.rejected, (state, action) => {
        // state.isLoading = false;
        // state.isError = true;
      });
  },
});

export const {handleSelectPokemon} = pokedexReducer.actions;

export default pokedexReducer.reducer;
