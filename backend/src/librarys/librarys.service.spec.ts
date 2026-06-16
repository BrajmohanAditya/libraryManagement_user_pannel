import { Test, TestingModule } from '@nestjs/testing';
import { LibrarysService } from './librarys.service';

describe('LibrarysService', () => {
  let service: LibrarysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibrarysService],
    }).compile();

    service = module.get<LibrarysService>(LibrarysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
