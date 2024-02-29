import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../contexts/telegram.context';
import { UploadNewVideoKeyboardButton } from '../../buttons/keyboard-buttons/admin/upload-new-video.keyboard-button';
import { DeleteVideosKeyboardButton } from '../../buttons/keyboard-buttons/admin/delete-videos.keyboard-button';

export const GetVideosMenuAction = async ({
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
            ...(await UploadNewVideoKeyboardButton({
              lang,
              i18n,
            })),
            ...(await DeleteVideosKeyboardButton({
              lang,
              i18n,
            })),
          ],
        ],
      },
    },
  );
};
