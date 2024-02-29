import { I18nService } from 'nestjs-i18n';
import { CancelKeyboardButton } from '../../../buttons/keyboard-buttons/admin/common/cancel.keyboard-button';
import { TelegramContext } from '../../../../../contexts/telegram.context';

export const WriteTextAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.WRITE_NEW_TEXT', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            ...(await CancelKeyboardButton({
              lang,
              i18n,
            })),
          ],
        ],
      },
    },
  );
};
