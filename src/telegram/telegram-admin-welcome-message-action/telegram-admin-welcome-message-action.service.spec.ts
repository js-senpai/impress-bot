import { Test, TestingModule } from '@nestjs/testing';
import { TelegramAdminWelcomeMessageActionService } from './telegram-admin-welcome-message-action.service';

describe('TelegramAdminWelcomeMessageActionService', () => {
  let service: TelegramAdminWelcomeMessageActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramAdminWelcomeMessageActionService],
    }).compile();

    service = module.get<TelegramAdminWelcomeMessageActionService>(TelegramAdminWelcomeMessageActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
