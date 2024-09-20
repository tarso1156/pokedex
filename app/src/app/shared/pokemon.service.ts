import { Injectable } from "@angular/core";

import { environment } from '../../environments/environment.development';

@Injectable()
export class PokemonService {

  private static readonly API_URL = environment.pokeApiUrl;

}
