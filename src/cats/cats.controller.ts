import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  ForbiddenException,
  ValidationPipe,
  BadRequestException,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
//import { createCatSchema } from './schema/create-cat.schema';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
//import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
//import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  //@Post()
  //@UsePipes(new ZodValidationPipe(createCatSchema))
  //async create(@Body() createCatDto: CreateCatDto) {
  //  this.catsService.create(createCatDto);
  //}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get('httpexcep')
  @UseFilters(HttpExceptionFilter)
  async getExcep() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      403,
    );
  }

  @Get('badreq')
  async getBadReqExcep() {
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Some error description',
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return `This action returns a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
