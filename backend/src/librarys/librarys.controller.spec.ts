import { Test, TestingModule } from '@nestjs/testing';
import { LibrarysController } from './librarys.controller';
import { LibrarysService } from './librarys.service';

describe('LibrarysController', () => {
  let controller: LibrarysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrarysController],
      providers: [LibrarysService],
    }).compile();

    controller = module.get<LibrarysController>(LibrarysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
