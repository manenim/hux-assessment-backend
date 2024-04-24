import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  phoneNumber: string;

}
