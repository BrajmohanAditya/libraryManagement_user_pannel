import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sheet } from './entities/sheet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SheetsService {
  constructor(
    @InjectRepository(Sheet)
    private readonly sheetRepository: Repository<Sheet>
  ) { }


  async findByLibraryId(id: string) {
    const sheets = await this.sheetRepository.find({
      where: {
        library: {
          id: id,
        },
      },
    });

    return sheets.map((sheet) => ({
      id: sheet.id,
      sheetNumber: sheet.sheetNumber,
      isAvailable: sheet.isAvailable,
    }));
  }

}
