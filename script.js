const xhr = new XMLHttpRequest();
const api = 'https://pokeapi.co/api/v2/pokemon/';
localStorage.clear();

function Pokemon(id, name, type, img, cry, height, weight, abilities){
  this.id = id;
  this.name = name;
  this.type = type;
  this.img = img;
  this.cry = cry;
  this.height = height;
  this.weight = weight;
  this.abilities = abilities;
}

// function loadPokedexEntry(params) {
  
// }

async function getPokemonList(firstPokemon, lastPokemon){

  localStorage['firstPokemon'] = Number.parseInt(firstPokemon);
  localStorage['lastPokemon'] = Number.parseInt(lastPokemon);

  for(firstPokemon; firstPokemon <= lastPokemon; firstPokemon++){
    const apiWithID = api + firstPokemon;

    const pokemon = await getPokemons(apiWithID);

    localStorage['pokemon' + firstPokemon] = JSON.stringify(pokemon);

    const listItem = document.createElement('a');
    listItem.href = "#";
    listItem.setAttribute('class', 'list-group-item list-group-item-action');
    listItem.setAttribute('onclick', `getPokemonDetail(event, "pokemon" + ${firstPokemon})`);
    listItem.innerHTML = `${pokemon.id} <img src = ${pokemon.img} width="40px">` + pokemon.name.toUpperCase();

    document.querySelector(".list-group").appendChild(listItem)

  }
}

async function getPokemons(api){
  const response = await fetch(api);
  const data = await response.json();
  console.log(data);

  const pokemon = new Pokemon(data.id, data.name, data.types, data.sprites.front_default, data.cries.latest, data.height, data.weight, data.abilities);
  return pokemon;
}

function getPokemonDetail(event, storageID){

  for(const link of document.links) {
    link.classList.remove('active');
  }

  event.target.setAttribute('class', 'list-group-item list-group-item-action active');

  const stored = localStorage[storageID];
  if (stored)
    selectedPokemon = JSON.parse(stored);
  
  loadPokemon(selectedPokemon);
}

function nextPage(event){
  event.preventDefault();
  document.querySelector(".list-group").innerHTML = "";

  const firstPokemon = Number.parseInt(localStorage['firstPokemon']) + 10;
  const lastPokemon =  Number.parseInt(localStorage['lastPokemon']) + 10;
  
  getPokemonList(firstPokemon, lastPokemon);

  localStorage['firstPokemon'] = firstPokemon;
  localStorage['lastPokemon'] = lastPokemon;
}

function previousPage(event){
  event.preventDefault();
  document.querySelector(".list-group").innerHTML = "";

  const firstPokemon = localStorage['firstPokemon'] - 10;
  const lastPokemon = localStorage['lastPokemon'] - 10;
  
  getPokemonList(firstPokemon, lastPokemon);

  localStorage['firstPokemon'] = firstPokemon;
  localStorage['lastPokemon'] = lastPokemon;
}

async function searchPokemon(event){
  
  event.preventDefault();

  document.querySelector(".list-group").innerHTML = "";
  
  let pokemon = document.querySelector('#pokemon-name').value;
  let url = api + pokemon;

  const returnedPokemon = await getPokemons(url);

  localStorage['pokemon' + returnedPokemon.id] = JSON.stringify(returnedPokemon);

  const listItem = document.createElement('a');
  listItem.href = "#";
  listItem.setAttribute('class', 'list-group-item list-group-item-action');
  listItem.setAttribute('onclick', `getPokemonDetail(event, "pokemon" + ${returnedPokemon.id})`);
  listItem.innerHTML = `${returnedPokemon.id} <img src = ${returnedPokemon.img} width="40px">` + returnedPokemon.name.toUpperCase();

  document.querySelector(".list-group").appendChild(listItem)
}

function loadPokemon(selectedPokemon){

  const audio = new Audio(selectedPokemon.cry);

  let pokemonType = "";
  let pokemonAbilities ="";

  if (selectedPokemon.type.length == 2) {
    pokemonType = selectedPokemon.type[0].type.name + " / " + selectedPokemon.type[1].type.name
  } else {
    pokemonType = selectedPokemon.type[0].type.name
  }

  for (let i = 0; i < selectedPokemon.abilities.length; i++){
    if (i == selectedPokemon.abilities.length - 1){
      pokemonAbilities += selectedPokemon.abilities[i].ability.name;
    } else {
      pokemonAbilities += selectedPokemon.abilities[i].ability.name + ", ";
    }
  }
  
  document.querySelector('.pokemon-image').querySelector('img').src = selectedPokemon.img;
  document.querySelector('.pokemon-image').querySelector('img').classList.remove('pokeball')
  document.querySelector('.pokemon-name').innerHTML = selectedPokemon.name.toUpperCase();
  document.querySelector('#pokeID').innerHTML = selectedPokemon.id;
  document.querySelector('#pokeName').innerHTML = selectedPokemon.name.toUpperCase();
  document.querySelector('#pokeType').innerHTML = pokemonType.toUpperCase();;
  document.querySelector('#pokeHeight').innerHTML = selectedPokemon.height / 10 + 'm';
  document.querySelector('#pokeWeight').innerHTML = selectedPokemon.weight /10 + 'kg';
  document.querySelector('#pokeAbilities').innerHTML = pokemonAbilities.toUpperCase();

  audio.play();
}

window.addEventListner("load", getPokemonList(1, 10));