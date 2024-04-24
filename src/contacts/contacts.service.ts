import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'src/contacts/entities/contact.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly usersService: UsersService,
  ) {}
  async create(
    userId: string,
    createContactDto: CreateContactDto,
  ): Promise<Contact> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!userId)
        throw new UnauthorizedException(
          'you need to be logged in to complete this action',
        );
      let contact = new Contact();
      contact.user = user;
      contact = { ...contact, ...createContactDto };
      return await this.contactRepository.save(contact);
    } catch (error) {
      throw new InternalServerErrorException('there was an error: \n' + error);
    }
  }

  async findAllByUserId(userId: string): Promise<Contact[]> {
    console.log('entered service');
    if (!userId) {
      throw new UnauthorizedException(
        'You need to be logged in to access contacts',
      );
    }

    const queryBuilder = this.contactRepository.createQueryBuilder('contact');
    queryBuilder.where('contact.userId = :userId', { userId });
    queryBuilder.leftJoinAndSelect('contact.user', 'user'); // Includes user data

    const contacts = await queryBuilder.getMany();
    return contacts;
  }

  async findOneByUserId(userId: string, contactId: string): Promise<Contact> {
    if (!userId) {
      throw new UnauthorizedException(
        'You need to be logged in to access contacts',
      );
    }

    const queryBuilder = this.contactRepository.createQueryBuilder('contact');
    queryBuilder.where('contact.userId = :userId', { userId });
    queryBuilder.andWhere('contact.id = :contactId', { contactId });
    queryBuilder.leftJoinAndSelect('contact.user', 'user');

    const contact = await queryBuilder.getOne();

    if (!contact) throw new NotFoundException('Contact was not found');

    return contact;
  }

  async updateByUserId(
    userId: string,
    contactId: string,
    updateData: UpdateContactDto,
  ): Promise<Contact> {
    if (!userId) {
      throw new UnauthorizedException(
        'You need to be logged in to update contacts',
      );
    }

    const contact = await this.findOneByUserId(userId, contactId);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    console.log('first', updateData);
    const queryBuilder = this.contactRepository.createQueryBuilder('contact');
    await queryBuilder
      .update(Contact)
      .set(updateData)
      .where('contact.id = :contactId', { contactId })
      .andWhere('contact.userId = :userId', { userId })
      .execute();
    const updatedContact = await this.findOneByUserId(userId, contactId);

    return updatedContact;
  }

  async deleteByUserId(userId: string, contactId: string): Promise<{message: string}> {
    if (!userId) {
      throw new UnauthorizedException(
        'You need to be logged in to delete contacts',
      );
    }
    try {
      const queryBuilder = this.contactRepository.createQueryBuilder('contact');
      const result = queryBuilder
        .delete()
        .from(Contact)
        .where('contact.id = :contactId', { contactId })
        .andWhere('contact.userId = :userId', { userId })
        .execute();

      if (!result) {
        throw new NotFoundException('Contact not found');
      }

      return {message: 'Successfilly deleted contact'}
    } catch (error) {
      throw new InternalServerErrorException('there was an error: \n' + error);
    }
  }
}
