import React from "react";
import {useDispatch, useSelector} from "react-redux";

const SelectedPokemonBar = React.memo(() => {
  const {selectedPokemon} = useSelector((state) => state.pokedex);
  const dispatch = useDispatch();

  console.log(selectedPokemon);
  if (!selectedPokemon) {
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
  } = selectedPokemon;

  const officialArt = other["official-artwork"].front_default;

  return (
    <div className="side">
      <img className="sprite-main" src={officialArt} alt={`${name}-sprite`} />
      <h4>{name}</h4>
      <p>#{id}</p>
    </div>
  );
});

export default SelectedPokemonBar;
