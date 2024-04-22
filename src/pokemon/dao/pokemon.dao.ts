import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from '../entities/pokemon.entity';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';

@Injectable()
export class PokemonDao {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(pokemonData: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonModel.create(pokemonData);
  }
  
  async findAll(limit: number, offset: number): Promise<Pokemon[]> {
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findByMongoId(id: string): Promise<Pokemon> {
    return this.pokemonModel.findById(id);
  }

  async findByNo(no: string): Promise<Pokemon> {
    return this.pokemonModel.findOne({ no: no });
  }
  
  async findOneByName(name: string): Promise<Pokemon> {
    return this.pokemonModel.findOne({ name: name.toLowerCase().trim() });
  }

  async update(pokemon: Pokemon, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    await pokemon.updateOne(updatePokemonDto);
    return pokemon;
  }

  async deleteOne(id: string): Promise<{ deletedCount: number }> {
    return this.pokemonModel.deleteOne({ _id: id });
  }
}
