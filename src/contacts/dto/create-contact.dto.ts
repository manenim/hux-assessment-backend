import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateContactDto {
  @ApiProperty({
    type: String,
    default: 'John',
    example: 'John',
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
    default: '09077447722',
    example: '09077447722',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    default: 'akachi@gmail.com',
    example: 'akachi@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    default: 'No5, Ota Road, Dugbe',
    example: 'No5, Ota Road, Dugbe',
  })
  @IsNotEmpty()
  @IsString()
  homeAddress: string;
}
