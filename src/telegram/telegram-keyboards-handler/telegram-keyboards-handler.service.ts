import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { TelegramAdminWelcomeMessageActionService } from '../telegram-admin-welcome-message-action/telegram-admin-welcome-message-action.service';
import { TelegramMailingActionService } from '../telegram-mailing-action/telegram-mailing-action.service';

@Injectable()
export class TelegramKeyboardsHandlerService {
  constructor(
    private readonly i18n: I18nService,
    private readonly telegramAdminWelcomeMessageAction: TelegramAdminWelcomeMessageActionService,
    private readonly telegramMailingAction: TelegramMailingActionService,
  ) {}

  async actionHandler({ message, ctx }: ITelegramBodyWithMessage) {
    const { session } = ctx;
    const getAllButtonsKeys = await this.i18n.translate(
      'telegram.BUTTONS.KEYBOARD_BUTTONS',
    );
    // Get key
    let getKey = 'not_set';
    for (const [key, value] of Object.entries(getAllButtonsKeys)) {
      if (value === message) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getKey = key;
      }
    }
    if (getKey === 'CANCEL') {
      return await this.telegramAdminWelcomeMessageAction.cancel({ ctx });
    }
    if (session.enableWritingText) {
      return await this.telegramAdminWelcomeMessageAction.updateText({
        ctx,
        message,
      });
    }
    if (session.enableMailing) {
      return await this.telegramMailingAction.sendMessages({
        ctx,
        message,
      });
    }
    if (getKey === 'MAILING') {
      return await this.telegramMailingAction.enableMailing({ ctx });
    }
    if (getKey === 'CHANGE_START_TEXT') {
      return await this.telegramAdminWelcomeMessageAction.enableWritingText({
        ctx,
      });
    }
    if (getKey === 'CHANGE_START_VIDEO') {
      return await this.telegramAdminWelcomeMessageAction.getVideosMenu({
        ctx,
      });
    }
    if (getKey === 'UPLOAD_NEW_VIDEO') {
      return await this.telegramAdminWelcomeMessageAction.enableUploadingVideo({
        ctx,
      });
    }
    if (getKey === 'DELETE_VIDEOS') {
      return await this.telegramAdminWelcomeMessageAction.getDeleteVideoList({
        ctx,
      });
    }
  }
}
