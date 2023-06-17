import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getPokemonOnload} from "../features/pokedexReducer";
import PokedexCard from "../components/Pokedex/PokedexCard";
import SelectedPokemonBar from "../components/Pokedex/SelectedPokemonBar";

const Pokedex = React.memo(() => {
  const {isLoading, isError, pokemonList} = useSelector(
    (state) => state.pokedex
  );
  const dispatch = useDispatch();

  const renderPokemon = () => {
    return pokemonList.map((item, index) => {
      return <PokedexCard key={index} pokemon={item} />;
    });
  };

  useEffect(() => {
    dispatch(getPokemonOnload({x: ""}));
  }, []);

  // console.log(pokemonList);

  if (isLoading || !pokemonList) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <h1>ERROR</h1>
      </div>
    );
  }

  return (
    <section className="pokedex-container">
      <header className="pokedex-header"></header>
      <div className="search-container"></div>
      <div className="filter-container"></div>
      <div className="middle">{renderPokemon()}</div>
      <SelectedPokemonBar />
    </section>
  );
});

export default Pokedex;
