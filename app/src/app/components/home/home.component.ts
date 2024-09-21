import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, Subject, switchMap, tap } from 'rxjs';

import { Pokemon } from '../../models/pokemon.model';

import { PokemonService } from '../../services/pokemon.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    TitleCasePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
    TooltipModule,
    MessageModule,
    TableModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly SEARCH_DELAY_MS = 600;

  search = {
    page: 1,
    limit: 20,
    term: '',
    loading: true
  };

  pokemons$ = new Observable<Pokemon[]>();
  pokemonsSearch$ = new Subject<string>();
  pokemons: Pokemon[] = [];

  constructor(private readonly pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.initialSetup();
    this.pokemonsSearch$.next('');
  }

  initialSetup() {
    this.pokemonsSearch$.pipe(
      tap(_ => this.search.loading = true),
      debounceTime(this.SEARCH_DELAY_MS),
      switchMap(() => (
        this.search.term ?
          this.pokemonService.fetchByName(this.search.term).pipe(
            tap(_ => this.search.page = 1),
            map(poke => this.pokemons = [poke]),
            catchError((e) => {
              if (e.error.statusCode === HttpStatusCode.NotFound) {
                this.pokemons = [];
              }
              return of(this.pokemons);
            })
          ) :
          this.pokemonService.fetchAll(this.search.page, this.search.limit).pipe(
            map(pokes => this.pokemons = pokes)
          )
      )),
      tap(_ => {
        this.search.loading = false;
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      }),
    ).subscribe();
  }

  searchPokemonByName() {
    this.pokemonsSearch$.next(this.search.term);
  }

  loadMorePokemons() {
    this.search.page++;
    this.pokemonsSearch$.next('');
  }

  clearSearch() {
    this.pokemons = [];
    this.search.term = '';
    this.pokemonsSearch$.next('');
  }

  fetchPokemonDetails(pokemon: Pokemon) {
    this.pokemonService.fetchDetails(pokemon).subscribe(details => {
      pokemon.details = details
    });
  }

  clearPokemonDetails(pokemon: Pokemon) {
    pokemon.details = undefined;
  }

}
