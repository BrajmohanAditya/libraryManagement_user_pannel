import { Controller, Get, Param,  } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}


  

  @Get(':id')
  findByLibraryId(@Param('id') id: string) {
    return this.sheetsService.findByLibraryId(id);
  }

}
