import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 3
    })
    @IsString()
    @MinLength(1)
    title: string;
    
    @ApiProperty({
        description: 'Product price',
        example: 29.99,
        required: false,
        default: 0,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Product description',
        example: 'Camiseta de algodón 100% orgánico',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product slug (for SEO)',
        example: 'camiseta_teslo',
        required: false,
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Product stock',
        example: 10,
        required: false,
        default: 0,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Available product sizes',
        example: ['S', 'M', 'L'],
        isArray: true,
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product gender (men, women, kid, unisex)',
        example: 'men',
        enum: ['men', 'women', 'unisex', 'kid'],
    })
    @IsIn(['men', 'women', 'unisex', 'kid'])
    gender: string;

    @ApiProperty({
        description: 'Product tags',
        example: ['camiseta', 'algodon', 'teslo'],
        isArray: true,
        required: false,
        default: [],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];
    
    @ApiProperty({
        description: 'Product image URLs',
        example: [
            'https://teslo.com/images/camiseta1.jpg',
            'https://teslo.com/images/camiseta2.jpg'
        ],
        isArray: true,
        required: false,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images: string[];
}
