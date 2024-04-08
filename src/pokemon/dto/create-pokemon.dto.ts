import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    
    
    // isint, ispositive, min
    @IsInt()
    @IsPositive()
    @Min(1)
    readonly no: number;

    // isstring, minlenth
    @IsString()
    @MinLength(1)
    name: string;
}
