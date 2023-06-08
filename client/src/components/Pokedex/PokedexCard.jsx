import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleSelectPokemon} from "../../features/pokedexReducer";
import {useDispatch, useSelector} from "react-redux";

const PokedexCard = React.memo(({pokemon}) => {
  const dispatch = useDispatch();
  const {url} = pokemon;
  const [pokemonData, setPokemonData] = useState(null);

  const renderTypes = () => {
    const {types} = pokemonData;

    return types.map((item, index) => {
      const {
        type: {name},
      } = item;
      return <p key={index}>{name}</p>;
    });
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const data = (await axios.get(url)).data;
        setPokemonData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPokemonData();
  }, [url]);

  if (!pokemonData) {
    return <p>Loading...</p>;
  }

  const {
    sprites: {versions},
    id,
    name,
  } = pokemonData;

  const animatedSprite = versions["generation-v"]["black-white"].animated;
  const frontSprite = animatedSprite.front_default;
  const backSprite = animatedSprite.back_default;

  return (
    <div
      className="pokemon-card"
      onClick={() => dispatch(handleSelectPokemon(pokemonData))}
    >
      <img className="sprite" src={frontSprite} alt={`${name} sprite`} />
      <h4>{name}</h4>
      {renderTypes()}
      <p>#{id}</p>
    </div>
  );
});

export default PokedexCard;
