import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pokemon } from '../models/pokemon.model';

import { environment } from '../../environments/environment.development';

@Injectable()
export class PokemonService {

  private readonly API_URL = environment.pokeApiUrl;

  constructor(private readonly httpClient: HttpClient) {}

  fetchAll(page: number, limit: number): Observable<Pokemon[]> {
    const params = {
      page,
      limit
    }
    return this.httpClient.get<Pokemon[]>(`${this.API_URL}`, { params });
  }

  fetchByName(searchTerm: string): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(`${this.API_URL}/${searchTerm}`);
  }

}
