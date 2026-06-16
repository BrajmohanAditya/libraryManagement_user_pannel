import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryFeature } from './entities/library-feature.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LibraryFeatureService {
 
  constructor(
    @InjectRepository(LibraryFeature)
    private readonly libraryFeatureRepository: Repository<LibraryFeature>,
  ) {}
 async findByLibraryId(id: string) {
    const data = await this.libraryFeatureRepository.find({
      where: { libraryId: id },

    });

    if (!data) {
      return {
        message: 'Library not found',
      };
    }

    return {
      message: 'Library retrieved successfully',
      data,
    };
  }

  
}
