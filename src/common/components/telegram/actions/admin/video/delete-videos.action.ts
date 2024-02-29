import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { welcomeVideos } from '@prisma/client';
import { TelegramActionsEnums } from '../../../../../enums/telegram-actions.enums';

export const DeleteVideosAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  videos = [],
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  videos: Pick<welcomeVideos, 'fileName' | 'uniqueName'>[];
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.DELETE_VIDEOS', {
      lang,
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          videos.map(({ fileName, uniqueName }) => ({
            text: fileName,
            callback_data: JSON.stringify({
              type: TelegramActionsEnums.DELETE_VIDEO,
              value: uniqueName,
            }),
          })),
        ],
      },
    },
  );
};
