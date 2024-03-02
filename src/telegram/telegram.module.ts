import { Logger, Module } from '@nestjs/common';
import { TelegramVideoHandlerService } from './telegram-video-handler/telegram-video-handler.service';
import { TelegramAdminWelcomeMessageActionService } from './telegram-admin-welcome-message-action/telegram-admin-welcome-message-action.service';
import { TelegramUpdate } from './telegram.update';
import { TelegramStartHandlerService } from './telegram-start-handler/telegram-start-handler.service';
import { TelegramInlineHandlerService } from './telegram-inline-handler/telegram-inline-handler.service';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler/telegram-keyboards-handler.service';
import { PrismaService } from '../common/services/prisma.service';
import { TelegramFileService } from '../common/services/telegram-file.service';
import { TelegramMailingActionService } from './telegram-mailing-action/telegram-mailing-action.service';
import { TelegramAnalyticsActionService } from './telegram-analytics-action/telegram-analytics-action.service';

@Module({
  providers: [
    Logger,
    PrismaService,
    TelegramFileService,
    TelegramMailingActionService,
    TelegramAdminWelcomeMessageActionService,
    TelegramStartHandlerService,
    TelegramInlineHandlerService,
    TelegramKeyboardsHandlerService,
    TelegramVideoHandlerService,
    TelegramAdminWelcomeMessageActionService,
    TelegramUpdate,
    TelegramAnalyticsActionService,
  ],
})
export class TelegramModule {}
