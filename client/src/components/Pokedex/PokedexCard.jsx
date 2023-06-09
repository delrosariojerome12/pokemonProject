import React, {useEffect, useState} from "react";
import axios from "axios";
import {handleSelectPokemon} from "../../features/pokedexReducer";
import {useDispatch, useSelector} from "react-redux";

const PokedexCard = React.memo(({pokemon}) => {
  const {selectedPokemon} = useSelector((state) => state.pokedex);
  const dispatch = useDispatch();
  const {url} = pokemon;
  const [pokemonData, setPokemonData] = useState(null);

  const renderTypes = () => {
    const {types} = pokemonData;

    return types.map((item, index) => {
      const {
        type: {name},
      } = item;

      let typeColor = "";

      switch (name) {
        case "normal":
          typeColor = "#A8A77A";
          break;

        case "fire":
          typeColor = "#EE8130";
          break;

        case "water":
          typeColor = "#6390F0";
          break;

        case "electric":
          typeColor = "#F7D02C";
          break;

        case "grass":
          typeColor = "#7AC74C";
          break;

        case "ice":
          typeColor = "#96D9D6";
          break;

        case "fighting":
          typeColor = "#C22E28";
          break;

        case "poison":
          typeColor = "#A33EA1";
          break;

        case "ground":
          typeColor = "#E2BF65";
          break;

        case "flying":
          typeColor = "#A98FF3";
          break;

        case "psychic":
          typeColor = "#F95587";
          break;

        case "bug":
          typeColor = "#A6B91A";
          break;

        case "rock":
          typeColor = "#B6A136";
          break;

        case "ghost":
          typeColor = "#735797";
          break;

        case "dragon":
          typeColor = "#6F35FC";
          break;

        case "dark":
          typeColor = "#705746";
          break;

        case "steel":
          typeColor = "#B7B7CE";
          break;

        case "fairy":
          typeColor = "#D685AD";
          break;

        default:
          break;
      }

      if (typeColor) {
        return (
          <div
            className="type-pokemon"
            style={{background: typeColor, textTransform: "uppercase"}}
            key={index}
          >
            <p>{name}</p>
          </div>
        );
      }
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
      className={
        selectedPokemon?.id === id ? "pokemon-card selected" : "pokemon-card"
      }
      onClick={() => dispatch(handleSelectPokemon(pokemonData))}
    >
      <p>#{id}</p>
      <img className="sprite" src={frontSprite} alt={`${name} sprite`} />
      <h4>{name}</h4>
      <div className="type-container">{renderTypes()}</div>
    </div>
  );
});

export default PokedexCard;
