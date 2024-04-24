import { TestingModule, Test } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { User } from 'src/users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

const mockUserService = {
  findOne: jest.fn(), 
};

const mockContactsService = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findOneByUserId: jest.fn(),
  updateByUserId: jest.fn(),
  deleteByUserId: jest.fn(),
};

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        { provide: ContactsService, useValue: mockContactsService },
        { provide: JwtAuthGuard, useValue: jest.fn() }, 
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    

    it('should throw UnauthorizedException for missing user', async () => {
      const createContactDto: CreateContactDto = {
        firstname: 'John',
        lastname: 'Doe',
        phoneNumber: 'johndoe@example.com',
      };

      await expect(controller.create(null, createContactDto)).rejects.toThrow(UnauthorizedException);
      expect(service.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllByUserId', () => {
    

    it('should throw UnauthorizedException for missing user', async () => {
      await expect(controller.findAllByUserId(null)).rejects.toThrow(UnauthorizedException);
      expect(service.findAllByUserId).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
   

    it('should throw UnauthorizedException for missing user', async () => {
      const contactId = '1';

      await expect(controller.findOne(null, contactId)).rejects.toThrow(UnauthorizedException);
      expect(service.findOneByUserId).not.toHaveBeenCalled();
    });

  })
})