import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {debounce} from "lodash";
import axios from "axios";
import {FaChevronRight, FaChevronLeft} from "react-icons/fa";
import {GrRevert} from "react-icons/gr";
import {IconContext} from "react-icons/lib";

import LoadingPokemon from "../LoadingPokemon";

const SelectedPokemonBar = React.memo(() => {
  const {selectedPokemon} = useSelector((state) => state.pokedex);
  const [moreDetails, setMoreDetails] = useState(null);
  const [typeDetails, setTypeDetails] = useState(null);

  const dispatch = useDispatch();

  const renderTypes = (types) => {
    // const {types} = selectedPokemon;

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

  const filterPokemonTypes = (option) => {
    const filterDups = [];

    typeDetails.map((item, index) => {
      const {
        damage_relations: {double_damage_from, half_damage_from},
      } = item;
      const choice = option === "weak" ? double_damage_from : half_damage_from;

      choice.map((type, index) => {
        const {name} = type;
        filterDups.push(name);
      });
    });
    return [...new Set(filterDups)];
  };

  const renderPokemonTypes = (option) => {
    return filterPokemonTypes(option).map((item, index) => {
      let typeColor = "";
      switch (item) {
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
            <p>{item}</p>
          </div>
        );
      }
    });
  };

  const getTypes = () => {
    const {types} = selectedPokemon;
    return types.map((item, index) => {
      const {
        type: {url},
      } = item;
      return url;
    });
  };

  useEffect(() => {
    const fetchPokemonData = debounce(async () => {
      try {
        const {
          species: {url},
        } = selectedPokemon;
        const typeUrls = [...getTypes()];

        const response = await axios.get(url);
        const data = response.data;

        const typeResponses = await Promise.all(
          typeUrls.map((typeUrl) =>
            axios.get(typeUrl).then((response) => response.data)
          )
        );

        setMoreDetails(data);
        setTypeDetails(typeResponses);
      } catch (error) {
        console.log(error);
      }
    }, 500);

    if (selectedPokemon) {
      fetchPokemonData();
    }
  }, [selectedPokemon]);

  if (!selectedPokemon || !moreDetails || !typeDetails) {
    return (
      <div className="side">
        <LoadingPokemon />
      </div>
    );
  }
  if (moreDetails.name !== selectedPokemon.name) {
    return (
      <div className="side">
        <LoadingPokemon />
      </div>
    );
  }

  const {
    name,
    sprites: {other},
    id,
    height,
    weight,
    base_experience,
    types,
  } = selectedPokemon;

  const {flavor_text_entries, genera} = moreDetails;

  const filterDexEntries = () => {
    const dex = flavor_text_entries.filter((item, index) => {
      const {
        language: {name},
      } = item;
      return name === "en" && item;
    });
    return dex[dex.length - 1].flavor_text;
  };

  const filterGenera = () => {
    const genus = genera.filter((item, index) => {
      const {
        language: {name},
        genus,
      } = item;
      return name === "en" && genus;
    })[0].genus;
    return genus;
  };

  const pokedexEntry = filterDexEntries();
  const officialArt = other["official-artwork"].front_default;

  // console.log(moreDetails);

  return (
    <IconContext.Provider value={{className: "icon"}}>
      <div className="side">
        <img className="sprite-main" src={officialArt} alt={`${name}-sprite`} />
        <p>#{id}</p>
        <h4>{name}</h4>
        <p style={{color: "#6e6e6e"}}>{filterGenera()}</p>
        <div className="type-container">{renderTypes(types)}</div>
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
        <div className="base-exp">
          <h4>Base Exp</h4>
          <p>{base_experience}</p>
        </div>

        <div className="weakness-container">
          <h4>Weaknesses</h4>
          <div className="weakness-types">{renderPokemonTypes("weak")}</div>
        </div>
        <div className="resistence-container">
          <h4>Resistances</h4>
          <div className="weakness-types">{renderPokemonTypes("strength")}</div>
        </div>

        <span className="right-button">
          <FaChevronRight />
        </span>
        <span className="left-button">
          <FaChevronLeft />
        </span>
        <span className="revert-button">
          <GrRevert />
        </span>

        {/* <div className="stats-container"></div>
      <div className="evolution-container"></div>
      <div className="control-container"></div> */}
      </div>
    </IconContext.Provider>
  );
});

export default SelectedPokemonBar;
