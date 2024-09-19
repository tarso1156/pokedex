import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class PokemonService {

    private readonly API_URL = process.env.POKEDEX_API_URL;

    constructor(
        private readonly httpService: HttpService,
    ) {}

    findAll(page: number, limit: number) {
        const offset = ((page - 1) * limit);

        return this.httpService.get<any>(`${this.API_URL}/pokemon?offset=${offset}&limit=${limit}`).pipe(
            map(result => ({ ...result?.data })),
        );
    }

    findByName(name: string) {
        return this.httpService.get<any>(`${this.API_URL}/pokemon/${name}`).pipe(
            map(result => ({ ...result?.data })),
        );
    }
}
