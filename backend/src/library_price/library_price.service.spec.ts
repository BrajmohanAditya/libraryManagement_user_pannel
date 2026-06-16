import { Test, TestingModule } from '@nestjs/testing';
import { LibraryPriceService } from './library_price.service';

describe('LibraryPriceService', () => {
  let service: LibraryPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryPriceService],
    }).compile();

    service = module.get<LibraryPriceService>(LibraryPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
