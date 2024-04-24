import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { UsersService } from 'src/users/users.service'; 
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Contact } from './entities/contact.entity';


const mockUserService = {
  findOne: jest.fn(), 
};

const mockContactRepository = {
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn(),
    andWhere: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    getOne: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
    execute: jest.fn(),
    delete: jest.fn(),
    from: jest.fn(),
  }),
};

describe('ContactsService', () => {
  let service: ContactsService;
  let usersService: UsersService;
  let contactRepository: any; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: UsersService, useValue: mockUserService }, 
        { provide: 'ContactRepository', useValue: mockContactRepository }, 
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    usersService = module.get<UsersService>(UsersService);
    contactRepository = module.get('ContactRepository'); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new contact', async () => {
      const userId = '123';
      const createContactDto: CreateContactDto = {
        firstname: 'John',
        lastname: 'Doe',
        phoneNumber: 'johndoe@example.com',
      };
      const user = { id: userId };
      mockUserService.findOne.mockReturnValue(user);
      mockContactRepository.save.mockReturnValue(Promise.resolve({ ...createContactDto, id: 1 }));

      const contact = await service.create(userId, createContactDto);
      expect(contact).toEqual({ ...createContactDto, id: 1 });
      expect(usersService.findOne).toHaveBeenCalledWith(userId); // Verify user lookup
      expect(mockContactRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for missing user ID', async () => {
      const userId = '';
      const createContactDto: CreateContactDto = {
        firstname: 'John',
        lastname: 'Doe',
        phoneNumber: 'johndoe@example.com',
      };

      await expect(service.create(userId, createContactDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOne).not.toHaveBeenCalled(); // Verify no user lookup
      expect(mockContactRepository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on save error', async () => {
      const userId = '123';
      const createContactDto: CreateContactDto = {
        firstname: 'John',
        lastname: 'Doe',
        phoneNumber: 'johndoe@example.com',
      };
      const user = { id: userId };
      mockUserService.findOne.mockReturnValue(user);
      mockContactRepository.save.mockImplementation(() => {
        throw new Error('Some error');
      });

      await expect(service.create(userId, createContactDto)).rejects.toThrow(InternalServerErrorException);
      expect(usersService.findOne).toHaveBeenCalledWith(userId); // Verify user lookup
      expect(mockContactRepository.save).toHaveBeenCalled();
    });
  })
})


describe('updateByUserId', () => {
  let service: ContactsService;
  let usersService: UsersService;
  let contactRepository: any; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: UsersService, useValue: mockUserService }, 
        { provide: 'ContactRepository', useValue: mockContactRepository }, 
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    usersService = module.get<UsersService>(UsersService);
    contactRepository = module.get('ContactRepository'); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })
  it('should update a contact for a user', async () => {
    const userId = '123';
    const contactId = '1';
    const existingContact = { id: 1, firstname: 'John', lastname: 'Doe', phone: '123-456-7890' };
    const updateData: UpdateContactDto = { firstname: 'Jane' };
    mockContactRepository.createQueryBuilder.mockReturnValueOnce({
      where: jest.fn().mockReturnValueOnce({
        getOne: jest.fn().mockReturnValue(existingContact),
        update: jest.fn().mockReturnValue({ execute: jest.fn() }),
      }),
    });

    const updatedContact = await service.updateByUserId(userId, contactId, updateData);
    expect(updatedContact).toEqual({ ...existingContact, ...updateData });
    expect(mockContactRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockContactRepository.createQueryBuilder().where).toHaveBeenCalledWith([
      'contact.userId = :userId',
      'contact.id = :contactId',
    ], { userId, contactId });
    expect(mockContactRepository.createQueryBuilder().set).toHaveBeenCalledWith(updateData);
  });

  it('should throw UnauthorizedException for missing user ID', async () => {
    const userId = '';
    const contactId = '1';
    const updateData: UpdateContactDto = { firstname: 'Jane Doe' };

    await expect(service.updateByUserId(userId, contactId, updateData)).rejects.toThrow(UnauthorizedException);
    expect(mockContactRepository.createQueryBuilder).not.toHaveBeenCalled();
  });

})