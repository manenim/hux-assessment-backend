import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.findUserByEmail(createUserDto.email);
      if (user) {
        throw new BadRequestException('Email already exists try logging in');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = { ...createUserDto, password: hashedPassword };
      const savedUser = await this.usersRepository.save(newUser);
      const { password, ...returnedUser } = savedUser
      
      return {
        message: 'User Created Succcessfully...',
        status: 200,
        data: returnedUser,
      };
    } catch (error: unknown) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'There was an error....',
        error,
      });
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async verifyEmailAndPassword(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException(
        'Email does not exist, you need to create an account first!',
      );
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      throw new UnauthorizedException('Incorrect Password, Try Again');
    return user;
  }
}
