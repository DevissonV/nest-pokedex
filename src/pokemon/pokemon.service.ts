import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException, 
  BadRequestException 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonDao } from './dao/pokemon.dao';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class PokemonService {
  private readonly defaultLimit: number;

  constructor(
    private readonly pokemonDao: PokemonDao,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('default_limit');
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      return await this.pokemonDao.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonDao.findAll(limit, offset);
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;
    
    if (!isNaN(+term)) {
      pokemon = await this.pokemonDao.findByNo(term);
    }

    // Mongo id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonDao.findByMongoId(term);
    }

    // name
    if (!pokemon) {
      pokemon = await this.pokemonDao.findOneByName(term);
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name, or no ${term} not found`);
    }
    return pokemon;
  }


  async update(term: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    const pokemon = await this.findOne(term);
    try {
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
      }

      const updatedPokemon = await this.pokemonDao.update(pokemon, updatePokemonDto);
      return { ...updatedPokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<void> {
    const { deletedCount } = await this.pokemonDao.deleteOne(id);
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon not found`);
    }
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in bd ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Can´t created/update Pokemon - cheek server logs`)
  }
}
