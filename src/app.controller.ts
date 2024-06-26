import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: 200, description: 'Server Is up and Running' })
  getHello(): string {
    return this.appService.getHello();
  }
}
