import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), CacheModule.register()],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokedexApiModule { }
