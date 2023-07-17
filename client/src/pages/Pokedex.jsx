import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
  getPokemonOnload,
  searchPokemonByName,
  loadMorePokemon,
} from "../features/pokedexReducer";
import PokedexCard from "../components/Pokedex/PokedexCard";
import SelectedPokemonBar from "../components/Pokedex/SelectedPokemonBar";
import PokeballLogo from "../assets/pokeball-png.png";
import {debounce} from "lodash";
import Loading from "../components/Loading/Loading";
import ErrorPage from "./ErrorPage";

const Pokedex = React.memo(() => {
  const {
    isLoading,
    isError,
    pokemonList,
    nextLink,
    isLoadMoreLoading,
    isLoadMoreError,
  } = useSelector((state) => state.pokedex);
  const dispatch = useDispatch();
  const [searchPokemon, setSearchPokemon] = useState("");

  const renderPokemon = () => {
    return pokemonList.map((item, index) => {
      return <PokedexCard key={index} pokemon={item} />;
    });
  };

  useEffect(() => {
    dispatch(getPokemonOnload({x: ""}));
  }, []);

  if (isLoading || !pokemonList) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorPage />;
  }

  return (
    <section className="pokedex-container">
      <header className="pokedex-header"></header>
      <div className="search-container">
        <input
          type="text"
          value={searchPokemon}
          placeholder="Search Pokemon"
          onChange={(e) => {
            setSearchPokemon(e.target.value);
          }}
        />
        <img src={PokeballLogo} alt="pokeball-logo" className="pokeball-logo" />
      </div>
      <div className="middle">
        <div className="pokecard-con">{renderPokemon()}</div>
        <button
          onClick={() => {
            dispatch(loadMorePokemon({nextLink}));
          }}
          className="load-btn"
        >
          {isLoadMoreLoading ? "Loading Pokemon..." : "Load More"}
        </button>
      </div>
      <SelectedPokemonBar />
    </section>
  );
});

export default Pokedex;
