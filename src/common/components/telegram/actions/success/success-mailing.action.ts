import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../contexts/telegram.context';
import { SendMailsKeyboardButton } from '../../buttons/keyboard-buttons/admin/mailing/send-mails.keyboard-button';
import { ChangeStartTextKeyboardButton } from '../../buttons/keyboard-buttons/admin/text/change-start-text.keyboard-button';
import { ChangeStartVideoKeyboardButton } from '../../buttons/keyboard-buttons/admin/video/change-start-video.keyboard-button';

export const SuccessMailingAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.SUCCESS.SENT_MAIL', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            ...(await SendMailsKeyboardButton({
              lang,
              i18n,
            })),
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
