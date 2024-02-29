import { Injectable } from '@nestjs/common';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { TelegramActionsEnums } from '../../common/enums/telegram-actions.enums';
import { TelegramAdminWelcomeMessageActionService } from '../telegram-admin-welcome-message-action/telegram-admin-welcome-message-action.service';

@Injectable()
export class TelegramInlineHandlerService {
  constructor(
    private readonly telegramAdminWelcomeMessageAction: TelegramAdminWelcomeMessageActionService,
  ) {}

  async actionHandler(ctx: TelegramContext): Promise<void> {
    const {
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback_query: { data },
      },
    } = ctx;
    const { type = 'notSet', value } = JSON.parse(data);
    if (type === TelegramActionsEnums.DELETE_VIDEO) {
      return await this.telegramAdminWelcomeMessageAction.acceptDeleteVideo({
        ctx,
        uniqueName: value,
      });
    }
  }
}
