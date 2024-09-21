import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class PokemonService {

    private readonly API_URL = 'https://pokeapi.co/api/v2';
    private readonly SPRITES_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

    constructor(
        private readonly httpService: HttpService,
    ) { }

    findAll(page: number, limit: number) {
        const offset = ((page - 1) * limit);

        return this.httpService.get<any>(`${this.API_URL}/pokemon?offset=${offset}&limit=${limit}`).pipe(
            map(result => (
                result.data?.results.map(({ name, url }) => (
                    {
                        name: name,
                        sprite_url: `${this.SPRITES_URL}/${url.split('/').at(-2)}.png`
                    }
                )))
            )
        );
    }

    findByName(name: string) {
        return this.httpService.get<any>(`${this.API_URL}/pokemon/${name.toLocaleLowerCase()}`).pipe(
            map(({ data: { name, id } }) => (
                {
                    name: name,
                    sprite_url: `${this.SPRITES_URL}/${id}.png`,
                }
            ))
        );
    }

    getDetails(name: string) {
        return this.httpService.get<any>(`${this.API_URL}/pokemon/${name.toLocaleLowerCase()}`).pipe(
            map(({ data: { abilities, types, stats } }) => (
                {
                    abilities: abilities?.map(({ ability: { name } }) => (name)),
                    types: types?.map(({ type: { name } }) => (name)),
                    stats: stats?.map(({ base_stat, stat: { name }}) => ({ name, value: base_stat }))
                }
            ))
        );
    }
}
