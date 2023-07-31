import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  selectedPokemon: null,
  previousPokemon: null,
  nextPokemon: null,
  pokemonList: null,
  isLoading: false,
  isError: false,
  nextLink: null,
  isLoadMoreLoading: false,
  isLoadMoreLoadingError: false,
  isSearchLoading: false,
  isSearchError: false,
  searchedPokemon: null,
  previousPokemonSearch: null,
  isSearching: false,
};

export const getPokemonOnload = createAsyncThunk(
  "/pokemon/onLoad",
  async ({x}, {rejectWithValue}) => {
    try {
      const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
      const {data: res} = await axios.get(url);

      const bulbasaurURL = `https://pokeapi.co/api/v2/pokemon/bulbasaur`;
      const {data: bulbasaurData} = await axios.get(bulbasaurURL);

      // return res;
      return {res, bulbasaurData};
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
export const searchPokemonByName = createAsyncThunk(
  "/pokemon/searchByName",
  async ({pokemonName}, {rejectWithValue}) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`;
      const {data: res} = await axios.get(url);
      const {data: otherData} = await axios.get(res.species.url);
      return {res, otherData};
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const loadMorePokemon = createAsyncThunk(
  "/pokemon/loadMorePokemon",
  async ({nextLink}, {rejectWithValue}) => {
    try {
      const url = `${nextLink}`;
      const {data: res} = await axios.get(url);
      return res;
    } catch (error) {
      console.log(error);
      rejectWithValue(error);
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
    handleSearchReset: (state, action) => {
      state.isSearching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPokemonOnload.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPokemonOnload.fulfilled, (state, action) => {
        const {
          res: {results, next},
          bulbasaurData,
        } = action.payload;
        const {id} = bulbasaurData;

        state.isLoading = false;
        state.nextLink = next;
        state.isError = false;
        console.log(results);
        state.pokemonList = results;
        state.selectedPokemon = bulbasaurData;

        state.nextPokemon = id + 1;
        state.previousPokemon = id === 1 ? id : id - 1;
      })
      .addCase(getPokemonOnload.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
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
    builder
      .addCase(searchPokemonByName.pending, (state, action) => {
        state.isSearchLoading = true;
        state.isSearchError = false;
      })
      .addCase(searchPokemonByName.fulfilled, (state, action) => {
        const {res: baseData, otherData: speciesData} = action.payload;
        const {id} = baseData;
        const {varieties} = speciesData;
        const varietiesList = varieties.map((item) => item.pokemon);

        state.isSearchLoading = false;
        state.isSearchError = false;
        state.searchedPokemon = baseData;
        state.selectedPokemon = baseData;
        state.nextPokemon = id + 1;
        state.previousPokemon = id === 1 ? id : id - 1;
        state.pokemonList = varietiesList;
        state.isSearching = true;
      })
      .addCase(searchPokemonByName.rejected, (state, action) => {
        console.log(action.payload);
        state.isSearchLoading = false;
        state.isSearchError = true;
      });
    builder
      .addCase(loadMorePokemon.pending, (state, action) => {
        state.isLoadMoreLoading = true;
        state.isLoadMoreLoadingError = false;
        // state.nextLink =
      })
      .addCase(loadMorePokemon.fulfilled, (state, action) => {
        const {next, results} = action.payload;
        state.isLoadMoreLoading = false;
        state.isLoadMoreLoadingError = false;
        state.nextLink = next;
        state.pokemonList = [...state.pokemonList, ...results];
      })
      .addCase(loadMorePokemon.rejected, (state, action) => {
        state.isLoadMoreLoading = false;
        state.isLoadMoreLoadingError = true;
      });
  },
});

export const {handleSelectPokemon, handleSearchReset} = pokedexReducer.actions;

export default pokedexReducer.reducer;
