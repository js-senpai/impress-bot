import { TelegramContext } from '../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';
import { ChangeStartTextKeyboardButton } from '../../buttons/keyboard-buttons/admin/change-start-text.keyboard-button';
import { ChangeStartVideoKeyboardButton } from '../../buttons/keyboard-buttons/admin/change-start-video.keyboard-button';
import * as fs from 'fs';
import { join } from 'path';
import { delay } from '../../../../utils/common.utils';
import { PickDateLinkInlineButton } from '../../buttons/inline-buttons/user/common/pick-date-link.inline-button';

export const WelcomeAction = async ({
  ctx,
  text = 'Welcome',
  isAdmin = false,
  videos = [],
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  isAdmin: boolean;
  videos: { fileName: string }[];
  text: string;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  for (const { fileName } of videos) {
    await delay(1000);
    await ctx.sendVideoNote({
      source: await fs.promises.readFile(
        join(__dirname, '..', '..', '..', '..', '..', '..', 'videos', fileName),
      ),
      filename: fileName,
    });
  }
  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: {
      ...(isAdmin && {
        resize_keyboard: true,
        keyboard: [
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
      }),
      inline_keyboard: [
        await PickDateLinkInlineButton({
          lang,
          i18n,
        }),
      ],
    },
  });
};
