import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {debounce} from "lodash";
import axios from "axios";

const SelectedPokemonBar = React.memo(() => {
  const {selectedPokemon} = useSelector((state) => state.pokedex);
  const [moreDetails, setMoreDetails] = useState(null);
  const dispatch = useDispatch();

  const renderTypes = () => {
    const {types} = selectedPokemon;

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

  const renderAbilites = () => {
    const {abilities} = selectedPokemon;
    return abilities.map((item, index) => {
      const {
        ability: {name},
        is_hidden,
      } = item;
      return (
        <div className="ability-pokemon" key={index}>
          <div className="ability">
            <p> {name}</p>
            {is_hidden && <p className="hidden-ability"> {`(Hidden)`} </p>}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    const fetchPokemonData = debounce(async () => {
      try {
        const {
          species: {url},
        } = selectedPokemon;
        const response = await axios.get(url);
        const data = response.data;
        setMoreDetails(data);
      } catch (error) {
        console.log(error);
      }
    }, 500);

    if (selectedPokemon) {
      fetchPokemonData();
    }
  }, [selectedPokemon]);

  if (!selectedPokemon || !moreDetails) {
    return (
      <div className="side">
        <h3>Loading...</h3>
      </div>
    );
  }
  if (moreDetails.name !== selectedPokemon.name) {
    return (
      <div className="side">
        <h3>Loading...</h3>
      </div>
    );
  }
  const {
    name,
    sprites: {other},
    id,
    height,
    weight,
  } = selectedPokemon;

  console.log(moreDetails);
  console.log(selectedPokemon);
  const {flavor_text_entries} = moreDetails;
  const pokedexEntry = flavor_text_entries[52].flavor_text;

  const officialArt = other["official-artwork"].front_default;

  return (
    <div className="side">
      <img className="sprite-main" src={officialArt} alt={`${name}-sprite`} />
      <p>#{id}</p>
      <h4>{name}</h4>
      <div className="type-container">{renderTypes()}</div>
      <div className="pokedex-entry">
        <h4>Pokédex</h4>
        <p>{pokedexEntry}</p>
      </div>
      <div className="abilites-container">{renderAbilites()}</div>
      <div className="physique-container">
        <div className="body-size">
          <h4>Height</h4>
          <p>{height}m</p>
        </div>
        <div className="body-size">
          <h4>Weight</h4>
          <p>{weight}kg</p>
        </div>
      </div>
    </div>
  );
});

export default SelectedPokemonBar;
