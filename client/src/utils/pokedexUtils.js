export const adjustTypings = (weak, resist, pokemonType) => {
  const pokemonTypeAdjusted = pokemonType.map((value, index) => {
    const {type: name} = value;
    return name.name;
  });

  const adjustedWeaknesses = weak
    .filter((value) => {
      return !pokemonTypeAdjusted.includes(value) && value;
    })
    .filter((value) => {
      return !resist.includes(value) && value;
    });

  const adjustedResistances = resist.filter((value) => {
    return !weak.includes(value) && value;
  });

  return {
    adjustedWeaknesses,
    adjustedResistances,
  };
};
