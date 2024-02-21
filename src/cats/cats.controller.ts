import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  ValidationPipe,
  BadRequestException,
  UseFilters,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
//import { createCatSchema } from './schema/create-cat.schema';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
//import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
//import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
//import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout.interceptor';
//import { ErrorsInterceptor } from 'src/common/interceptors/errors.interceptor';

@Controller('cats')
@UseInterceptors(LoggingInterceptor, TransformInterceptor, TimeoutInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  //@Post()
  //@UsePipes(new ZodValidationPipe(createCatSchema))
  //async create(@Body() createCatDto: CreateCatDto) {
  //  this.catsService.create(createCatDto);
  //}

  @Post()
  @Roles(['admin'])
  //@UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
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
