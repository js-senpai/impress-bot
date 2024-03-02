import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../../../../contexts/telegram.context';
import { ChoosePeriodAnalyticsInlineButton } from '../../../buttons/keyboard-buttons/admin/analytics/choose-period-analytics.inline-button';
import { CurrentDayAnalyticsKeyboardButton } from '../../../buttons/keyboard-buttons/admin/analytics/current-day-analytics.keyboard-button';
import { CancelKeyboardButton } from '../../../buttons/keyboard-buttons/admin/common/cancel.keyboard-button';

export const ChooseAnalyticsPeriodAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.SET_ANALYTICS_PERIOD', {
      lang,
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
