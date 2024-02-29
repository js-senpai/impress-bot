import { I18nService } from 'nestjs-i18n';
import { CancelKeyboardButton } from '../../buttons/keyboard-buttons/admin/cancel.keyboard-button';
import { TelegramContext } from '../../../../contexts/telegram.context';

export const UploadNewVideoAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.UPLOAD_NEW_VIDEO', {
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
