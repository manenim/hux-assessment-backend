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
  @IsEmail()
  phoneNumber: string;
}
