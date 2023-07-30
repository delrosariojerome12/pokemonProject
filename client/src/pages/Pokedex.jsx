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
import Loading from "../components/Loading/Loading";
import ErrorPage from "./ErrorPage";
import PokeballOpen from "../assets/open-pokeball.png";
// import BlackWhiteBall from "../assets/black-white-ball.png";
import BlackWhiteBall from "../assets/black-white-ball.svg";
import LoadingPokemon from "../components/LoadingPokemon";

const Pokedex = React.memo(() => {
  const {
    isLoading,
    isError,
    pokemonList,
    nextLink,
    isLoadMoreLoading,
    isLoadMoreError,
    isSearchLoading,
    isSearchError,
    searchedPokemon,
  } = useSelector((state) => state.pokedex);
  const dispatch = useDispatch();
  const [searchPokemon, setSearchPokemon] = useState("");
  const [isEntered, setIsEnter] = useState(false);

  const renderPokemon = () => {
    return pokemonList.map((item, index) => {
      return <PokedexCard key={index} pokemon={item} />;
    });
  };

  const handleSearchOnChange = (value) => {
    setSearchPokemon(value);
  };
  const handleOnKeydown = (e) => {
    if (e.key === "Enter" && searchPokemon.length > 2) {
      setIsEnter(true);
      dispatch(searchPokemonByName({pokemonName: searchPokemon}));
    }
    // if (e.key === "Backspace" && searchPokemon.length <= 2) {
    //   setIsEnter(false);
    // }
  };

  useEffect(() => {
    if (pokemonList === null) {
      dispatch(getPokemonOnload({x: ""}));
    } else {
      if (searchPokemon.length < 2) {
        setIsEnter(false);
      }
    }
  }, [searchPokemon]);

  if (isLoading || !pokemonList) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorPage />;
  }
  if (isSearchLoading) {
    return (
      <section className="pokedex-container">
        <header className="pokedex-header"></header>
        <div className="search-container">
          <input
            type="text"
            value={searchPokemon}
            placeholder="Search Pokemon..."
            onChange={(e) => handleSearchOnChange(e.target.value)}
            onKeyDown={handleOnKeydown}
          />

          <img
            src={BlackWhiteBall}
            alt="pokeball-logo"
            className={
              isEntered && searchPokemon.length > 2
                ? "pokeball-logo reversed"
                : "pokeball-logo"
            }
          />
        </div>
        <div className="middle loader">
          <LoadingPokemon />
        </div>
        <SelectedPokemonBar />
      </section>
    );
  }

  return (
    <section className="pokedex-container">
      <header className="pokedex-header"></header>
      <div className="search-container">
        <input
          type="text"
          value={searchPokemon}
          placeholder="Search Pokemon..."
          onChange={(e) => handleSearchOnChange(e.target.value)}
          onKeyDown={handleOnKeydown}
        />

        <img
          src={BlackWhiteBall}
          alt="pokeball-logo"
          className={
            isEntered && searchPokemon.length > 2
              ? "pokeball-logo reversed"
              : "pokeball-logo"
          }
        />
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
