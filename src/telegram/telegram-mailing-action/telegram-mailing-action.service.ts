import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { delay } from '../../common/utils/common.utils';
import { CheckAdminDecorator } from '../../common/decorators/check-admin.decorator';
import { SuccessMailingAction } from '../../common/components/telegram/actions/success/success-mailing.action';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { EnableMailingAction } from '../../common/components/telegram/actions/admin/mailing/enable-mailing.action';

@Injectable()
export class TelegramMailingActionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  @CheckAdminDecorator()
  async enableMailing({ ctx }: { ctx: TelegramContext }) {
    const { session } = ctx;
    await EnableMailingAction({
      ctx,
      i18n: this.i18n,
    });
    session.enableMailing = true;
  }

  @CheckAdminDecorator()
  async sendMessages({ message, ctx }: ITelegramBodyWithMessage) {
    const { session } = ctx;
    const getUsers = await this.prismaService.user.findMany({
      where: {
        isAdmin: false,
      },
      select: {
        telegramId: true,
      },
    });
    session.enableMailing = false;
    for (const { telegramId } of getUsers) {
      await delay(1000);
      await ctx.sendMessage(message, {
        parse_mode: 'HTML',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        chat_id: telegramId,
      });
    }
    return await SuccessMailingAction({
      ctx,
      i18n: this.i18n,
    });
  }
}
