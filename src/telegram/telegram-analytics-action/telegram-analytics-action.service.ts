import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { CheckAdminDecorator } from '../../common/decorators/check-admin.decorator';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { AnalyticsMenuAction } from '../../common/components/telegram/actions/admin/analytics/analytics-menu.action';
import * as dayjs from 'dayjs';
import { SuccessTotalFoundUsersAction } from '../../common/components/telegram/actions/success/success-total-found-users.action';
import { ErrorIncorrectPeriodFormatAction } from '../../common/components/telegram/actions/errors/error-incorrect-period-format.action';
import { ChooseAnalyticsPeriodAction } from '../../common/components/telegram/actions/admin/analytics/choose-analytics-period.action';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
@Injectable()
export class TelegramAnalyticsActionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  @CheckAdminDecorator()
  async getAnalyticsMenu({ ctx }: { ctx: TelegramContext }) {
    return await AnalyticsMenuAction({
      ctx,
      i18n: this.i18n,
    });
  }

  @CheckAdminDecorator()
  async getAnalyticsByCurrentDay({ ctx }: { ctx: TelegramContext }) {
    const now = dayjs();
    const totalUsers = await this.prismaService.user.count({
      where: {
        isAdmin: false,
        createdAt: {
          gte: now.set('hours', 0).set('minutes', 0).toDate(),
          lt: now.set('hours', 23).set('minutes', 59).toDate(),
        },
      },
    });
    return await SuccessTotalFoundUsersAction({
      ctx,
      i18n: this.i18n,
      total: totalUsers,
    });
  }
  @CheckAdminDecorator()
  async enableGetAnalyticsByPeriod({ ctx }) {
    const { session } = ctx;
    await ChooseAnalyticsPeriodAction({
      ctx,
      i18n: this.i18n,
    });
    session.enableChoosingPeriod = true;
    return;
  }

  @CheckAdminDecorator()
  async getAnalyticsByPeriod({
    ctx,
    message,
  }: {
    message: string;
    ctx: TelegramContext;
  }) {
    const { session } = ctx;
    const regex = /^\d{2}\.\d{2}\.\d{4}-\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(message)) {
      session.enableChoosingPeriod = false;
      return await ErrorIncorrectPeriodFormatAction({
        ctx,
        i18n: this.i18n,
      });
    }
    const [startTime, endTime] = message.split('-');
    session.enableChoosingPeriod = false;
    const totalUsers = await this.prismaService.user.count({
      where: {
        isAdmin: false,
        createdAt: {
          gte: dayjs(startTime, 'DD.MM.YYYY').toDate(),
          lt: dayjs(endTime, 'DD.MM.YYYY').toDate(),
        },
      },
    });
    return await SuccessTotalFoundUsersAction({
      ctx,
      i18n: this.i18n,
      total: totalUsers,
    });
  }
}
