import { TelegramContext } from '../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';
import { ChangeStartTextKeyboardButton } from '../../buttons/keyboard-buttons/admin/text/change-start-text.keyboard-button';
import { ChangeStartVideoKeyboardButton } from '../../buttons/keyboard-buttons/admin/video/change-start-video.keyboard-button';
import * as fs from 'fs';
import { join } from 'path';
import { delay } from '../../../../utils/common.utils';
import { PickDateLinkInlineButton } from '../../buttons/inline-buttons/user/common/pick-date-link.inline-button';
import { SendMailsKeyboardButton } from '../../buttons/keyboard-buttons/admin/mailing/send-mails.keyboard-button';
import { AnalyticsKeyboardButton } from '../../buttons/keyboard-buttons/admin/analytics/analytics.keyboard-button';

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
  await ctx.sendDocument(
    {
      source: await fs.promises.readFile(
        join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          '..',
          'presentations',
          'presentation.pdf',
        ),
      ),
      filename: '3D план лікування.pdf',
    },
    {
      caption: text,
      parse_mode: 'HTML',
      reply_markup: {
        ...(isAdmin && {
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
        }),
        inline_keyboard: [
          await PickDateLinkInlineButton({
            lang,
            i18n,
          }),
        ],
      },
    },
  );
};
