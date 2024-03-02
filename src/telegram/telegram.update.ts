import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Logger, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../common/interceptors/response-time.interceptor';
import { TelegramContext } from '../common/contexts/telegram.context';
import { TelegramStartHandlerService } from './telegram-start-handler/telegram-start-handler.service';
import { TelegramInlineHandlerService } from './telegram-inline-handler/telegram-inline-handler.service';
import { TelegramKeyboardsHandlerService } from './telegram-keyboards-handler/telegram-keyboards-handler.service';
import { I18nService } from 'nestjs-i18n';
import { ErrorUnknownAction } from '../common/components/telegram/actions/errors/error-unknown.action';
import { TelegramVideoHandlerService } from './telegram-video-handler/telegram-video-handler.service';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
// @UseFilters(TelegrafExceptionFilter)
export class TelegramUpdate {
  constructor(
    private readonly telegramStartHandlerService: TelegramStartHandlerService,
    private readonly telegramInlineHandlerService: TelegramInlineHandlerService,
    private readonly telegramKeyboardHandlerService: TelegramKeyboardsHandlerService,
    private readonly telegramVideoHandlerService: TelegramVideoHandlerService,
    private readonly logger: Logger,
    private readonly i18n: I18nService,
  ) {}

  // Start
  @Start()
  async start(@Ctx() ctx: TelegramContext) {
    try {
      // Get data
      await this.telegramStartHandlerService.start(ctx);
    } catch (e) {
      this.logger.error(
        'Error in start method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
    }
  }

  @On('callback_query')
  async callbackQuery(@Ctx() ctx: TelegramContext) {
    try {
      await this.telegramInlineHandlerService.actionHandler(ctx);
    } catch (e) {
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
      ctx.session.enableWritingText = false;
      ctx.session.enableUploadingVideo = false;
      ctx.session.enableMailing = false;
      ctx.session.enableChoosingPeriod = false;
      this.logger.error(
        'Error in callbackQuery',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
    }
  }

  @On('video')
  async onVideo(
    @Message('text') message: string,
    @Ctx() ctx: TelegramContext,
  ): Promise<void> {
    try {
      await this.telegramVideoHandlerService.actionHandler({ ctx, message });
    } catch (e) {
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
      ctx.session.enableWritingText = false;
      ctx.session.enableUploadingVideo = false;
      ctx.session.enableMailing = false;
      ctx.session.enableChoosingPeriod = false;
      this.logger.error(
        'Error in onVideo method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
    }
  }

  @On('text')
  async onMessage(
    @Message('text') message: string,
    @Ctx() ctx: TelegramContext,
  ): Promise<void> {
    try {
      await this.telegramKeyboardHandlerService.actionHandler({
        message,
        ctx,
      });
    } catch (e) {
      ErrorUnknownAction({
        ctx,
        i18n: this.i18n,
      });
      ctx.session.enableWritingText = false;
      ctx.session.enableUploadingVideo = false;
      ctx.session.enableMailing = false;
      ctx.session.enableChoosingPeriod = false;
      this.logger.error(
        'Error in onMessage method',
        JSON.stringify(e?.response?.data || e.stack),
        TelegramUpdate.name,
      );
    }
  }
}
