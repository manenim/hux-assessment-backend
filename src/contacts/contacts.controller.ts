import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@SerializeOptions({ strategy: 'exposeAll' })
@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Contact' })
  @ApiResponse({ status: 200, description: 'Returns the created contact' })
  @UseInterceptors(ClassSerializerInterceptor)
  create(
    @CurrentUser() user: User,
    @Body() createContactDto: CreateContactDto,
  ) {
    if (!user) throw new UnauthorizedException('you need to log in');
    return this.contactsService.create(user.id, createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All contacts' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all contacts created by the user',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  findAllByUserId(@CurrentUser() user: User) {
    if (!user)
      throw new UnauthorizedException(
        'you need to log in to complete this action',
      );
    return this.contactsService.findAllByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a Contact' })
  @ApiQuery({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the contact with the provided Id',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    if (!user)
      throw new UnauthorizedException(
        'you need to log in to complete this action',
      );

    return this.contactsService.findOneByUserId(user.id, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Contact' })
  @ApiResponse({
    status: 200,
    description: 'Updates the specified contact information',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    if (!user) throw new UnauthorizedException('you need to log in');

    return this.contactsService.updateByUserId(user.id, id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Contact' })
  @ApiResponse({
    status: 200,
    description: 'Deletes the contact with the specified Id',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    if (!user)
      throw new UnauthorizedException(
        'you need to log in to complete this action',
      );
    return this.contactsService.deleteByUserId(user.id, id);
  }
}
