import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { ChangeStartTextKeyboardButton } from '../../../buttons/keyboard-buttons/admin/text/change-start-text.keyboard-button';
import { ChangeStartVideoKeyboardButton } from '../../../buttons/keyboard-buttons/admin/video/change-start-video.keyboard-button';
import { SendMailsKeyboardButton } from '../../../buttons/keyboard-buttons/admin/mailing/send-mails.keyboard-button';
import { AnalyticsKeyboardButton } from '../../../buttons/keyboard-buttons/admin/analytics/analytics.keyboard-button';

export const MenuAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.MENU', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            ...(await AnalyticsKeyboardButton({
              lang,
              i18n,
            })),
            ...(await SendMailsKeyboardButton({
              lang,
              i18n,
            })),
          ],
          [
            ...(await ChangeStartTextKeyboardButton({
              lang,
              i18n,
            })),
            ...(await ChangeStartVideoKeyboardButton({
              lang,
              i18n,
            })),
          ],
        ],
      },
    },
  );
};
