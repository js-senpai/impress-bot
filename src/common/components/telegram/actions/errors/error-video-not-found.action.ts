import { TelegramContext } from '../../../../contexts/telegram.context';
import { I18nService } from 'nestjs-i18n';

export const ErrorVideoNotFoundAction = async ({
  ctx,
  lang = 'ua',
  i18n,
}: {
  ctx: TelegramContext;
  lang?: string;
  i18n: I18nService;
}): Promise<void> => {
  await ctx.reply(
    await i18n.translate('telegram.ERRORS.NOT_FOUND_VIDEO', {
      lang,
    }),
    {
      parse_mode: 'HTML',
    },
  );
};
