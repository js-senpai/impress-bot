import { Test, TestingModule } from '@nestjs/testing';
import { TelegramAnalyticsActionService } from './telegram-analytics-action.service';

describe('TelegramAnalyticsActionService', () => {
  let service: TelegramAnalyticsActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramAnalyticsActionService],
    }).compile();

    service = module.get<TelegramAnalyticsActionService>(TelegramAnalyticsActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
