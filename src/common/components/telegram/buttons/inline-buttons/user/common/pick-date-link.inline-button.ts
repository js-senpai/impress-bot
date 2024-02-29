import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { FORM_URL } from '../../../../../../constants/common.constants';

export const PickDateLinkInlineButton = async ({
  lang = 'ua',
  i18n,
}: {
  lang?: string;
  i18n: I18nService;
}): Promise<InlineKeyboardButton[]> => [
  {
    text: await i18n.translate(
      'telegram.BUTTONS.INLINE_BUTTONS.PICK_THE_DATE',
      {
        lang,
      },
    ),
    url: FORM_URL,
  },
];
