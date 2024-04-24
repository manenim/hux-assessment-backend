import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    default: 'Johnny',
    example: 'Johnyy',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    type: String,
    default: 'Doe',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    type: String,
    default: 'johnny@gmail.com',
    example: 'johnny@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Johnny123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
