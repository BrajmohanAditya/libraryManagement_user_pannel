import { Test, TestingModule } from '@nestjs/testing';
import { LibraryPriceController } from './library_price.controller';
import { LibraryPriceService } from './library_price.service';

describe('LibraryPriceController', () => {
  let controller: LibraryPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryPriceController],
      providers: [LibraryPriceService],
    }).compile();

    controller = module.get<LibraryPriceController>(LibraryPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
