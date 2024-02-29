import { Test, TestingModule } from '@nestjs/testing';
import { TelegramVideoHandlerService } from './telegram-video-handler.service';

describe('TelegramVideoHandlerService', () => {
  let service: TelegramVideoHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramVideoHandlerService],
    }).compile();

    service = module.get<TelegramVideoHandlerService>(TelegramVideoHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
