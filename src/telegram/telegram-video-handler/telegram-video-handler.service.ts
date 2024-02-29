import { Injectable } from '@nestjs/common';
import { TelegramAdminWelcomeMessageActionService } from '../telegram-admin-welcome-message-action/telegram-admin-welcome-message-action.service';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';

@Injectable()
export class TelegramVideoHandlerService {
  constructor(
    private readonly telegramAdminWelcomeMessageAction: TelegramAdminWelcomeMessageActionService,
  ) {}

  async actionHandler({ ctx }: ITelegramBodyWithMessage) {
    const { session } = ctx;
    if (session.enableUploadingVideo) {
      return await this.telegramAdminWelcomeMessageAction.createNewVideo({
        ctx,
      });
    }
  }
}
