import { Controller, Get, HttpException, Param, Query, UseInterceptors } from "@nestjs/common";
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AxiosError } from 'axios';
import { catchError } from 'rxjs';

import { PokemonService } from './pokemon.service';

@Controller('pokemon')
@UseInterceptors(CacheInterceptor)
export class PokemonController {

    private static readonly MAX_PAGE_SIZE_LIMIT = 20;
    private static readonly TEN_MINUTES_IN_MS = 6E5;

    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    @CacheTTL(PokemonController.TEN_MINUTES_IN_MS)
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = PokemonController.MAX_PAGE_SIZE_LIMIT
    ) {
        return this.pokemonService.findAll(page, limit).pipe(
            catchError((e: AxiosError) => {
                throw new HttpException((e.response?.data as string), e.status || 500)
            })
        );
    }

    @Get(':name')
    @CacheTTL(PokemonController.TEN_MINUTES_IN_MS)
    findByName(@Param('name') name: string) {
        return this.pokemonService.findByName(name).pipe(
            catchError((e: AxiosError) => {
                throw new HttpException((e.response?.data as string), e.status || 500)
            })
        );
    }

    @Get(':name/details')
    @CacheTTL(PokemonController.TEN_MINUTES_IN_MS)
    details(@Param('name') name: string) {
        return this.pokemonService.getDetails(name).pipe(
            catchError((e: AxiosError) => {
                throw new HttpException((e.response?.data as string), e.status || 500)
            })
        );
    }

}
