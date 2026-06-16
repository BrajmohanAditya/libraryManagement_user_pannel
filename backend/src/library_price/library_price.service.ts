import { Injectable } from '@nestjs/common';
import { CreateLibraryPriceDto } from './dto/create-library_price.dto';
import { UpdateLibraryPriceDto } from './dto/update-library_price.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryPrice } from './entities/library_price.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LibraryPriceService {

  constructor(
    @InjectRepository(LibraryPrice)
    private readonly libraryPriceRepository: Repository<LibraryPrice>,
  ) { }




  async findByLibraryId(id: string) {
    const pricingPlans = await this.libraryPriceRepository.find({
      where: { libraryId: id }
    });
    return {
      message: "fetch pricing plans successfully",
      data: pricingPlans,
    }

  }


}
