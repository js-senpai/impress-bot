import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../contexts/telegram.context';
import { ChoosePeriodAnalyticsInlineButton } from '../../buttons/keyboard-buttons/admin/analytics/choose-period-analytics.inline-button';
import { CurrentDayAnalyticsKeyboardButton } from '../../buttons/keyboard-buttons/admin/analytics/current-day-analytics.keyboard-button';
import { CancelKeyboardButton } from '../../buttons/keyboard-buttons/admin/common/cancel.keyboard-button';

export const SuccessTotalFoundUsersAction = async ({
  ctx,
  lang = 'ua',
  i18n,
  total = 0,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
  total: number;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.SUCCESS.FOUND_USERS', {
      lang,
      args: {
        total,
      },
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [
            ...(await ChoosePeriodAnalyticsInlineButton({
              lang,
              i18n,
            })),
            ...(await CurrentDayAnalyticsKeyboardButton({
              lang,
              i18n,
            })),
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
