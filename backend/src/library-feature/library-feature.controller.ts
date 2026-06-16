import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibraryFeatureService } from './library-feature.service';
import { CreateLibraryFeatureDto } from './dto/create-library-feature.dto';
import { UpdateLibraryFeatureDto } from './dto/update-library-feature.dto';

@Controller('library-feature')
export class LibraryFeatureController {
  constructor(private readonly libraryFeatureService: LibraryFeatureService) { }


  @Get(':id')
  async findByLibraryId(@Param('id') id: string) {
    return this.libraryFeatureService.findByLibraryId(id);
  }

}
