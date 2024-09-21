import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, Subject, switchMap, tap } from 'rxjs';

import { Pokemon } from '../../models/pokemon.model';

import { PokemonService } from '../../shared/pokemon.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';

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
    CardModule
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
  pokemons!: Pokemon[];
  searchPokemonByName$ = new Subject<string>();

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
            map(poke => this.pokemons = [poke]),
            catchError((e) => {
              if (e.error.statusCode === 404) {
                this.pokemons = [];
              }
              return of(this.pokemons);
            })
          ) :
          this.pokemonService.fetchAll(this.search.page, this.search.limit).pipe(
            map(pokes => this.pokemons = pokes)
          )
      )),
      tap(_ => this.search.loading = false),
    ).subscribe();
  }

  searchPokemonByName() {
    this.pokemonsSearch$.next(this.search.term);
  }

  loadMorePokemons() {
    this.search.page++;
  }

}
