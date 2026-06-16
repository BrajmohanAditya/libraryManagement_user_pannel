import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibraryPriceService } from './library_price.service';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';

@Controller('library-price')
export class LibraryPriceController {
  constructor(private readonly libraryPriceService: LibraryPriceService) { }

  @Get(':libraryId')
  findByLibraryId(@Param('libraryId') libraryId: string) {
    return this.libraryPriceService.findByLibraryId(libraryId);
  }


}
