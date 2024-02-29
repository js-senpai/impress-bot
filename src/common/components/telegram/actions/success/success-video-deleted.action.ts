import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../contexts/telegram.context';

export const SuccessVideoDeletedAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  chatId,
  messageId,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  chatId: number;
  messageId: number;
}): Promise<void> => {
  await ctx.editMessageText(
    await i18n.translate('telegram.SUCCESS.VIDEO_DELETED', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chat_id: chatId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message_id: messageId,
    },
  );
};
