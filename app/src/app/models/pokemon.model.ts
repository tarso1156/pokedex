import { PokemonDetails } from './pokemon-details.model';

export interface Pokemon {
  name: string,
  url: string,
  sprite_url: string,
  details?: PokemonDetails
}
