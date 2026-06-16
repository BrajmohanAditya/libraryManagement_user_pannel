import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LibrarysService } from './librarys.service';

@Controller('librarys')
export class LibrarysController {
  constructor(private readonly librarysService: LibrarysService) {}

  @Get()
findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.librarysService.findAll(
    Number(page),
    Number(limit),
  );
}

@Get('search')
searchLibraries(
  @Query('q') q: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.librarysService.searchLibraries(
    q,
    Number(page),
    Number(limit),
  );
}

@Get('nearest')
findNearestLibraries(
  @Query('latitude') latitude: number,
  @Query('longitude') longitude: number,
  @Query('radius') radius: number = 5,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.librarysService.findNearestLibraries(
    Number(latitude),
    Number(longitude),
    Number(radius),
    Number(page),
    Number(limit),
  );
}
}