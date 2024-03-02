import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { WelcomeAction } from '../../common/components/telegram/actions/start/welcome.action';

@Injectable()
export class TelegramStartHandlerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async start(ctx: TelegramContext) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: {
          from: {
            id,
            is_bot = false,
            first_name = '',
            last_name = '',
            username,
          },
        },
      },
    } = ctx;
    if (is_bot) {
      throw new Error('You are the bot! 🤖');
    }
    const getUser = await this.prismaService.user.findUnique({
      where: {
        telegramId: id,
      },
      select: {
        id: true,
        isAdmin: true,
      },
    });
    if (getUser?.isAdmin) {
      session.enableUploadingVideo = false;
      session.enableWritingText = false;
      session.enableMailing = false;
      session.enableChoosingPeriod = false;
    }
    if (!getUser) {
      await this.prismaService.user.create({
        data: {
          telegramId: id,
          firstName: first_name,
          lastName: last_name,
          login: username,
        },
      });
    }
    const getText = await this.prismaService.welcomeText.findFirst({
      select: {
        text: true,
      },
    });
    const getVideos = await this.prismaService.welcomeVideos.findMany({
      select: {
        fileName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return await WelcomeAction({
      isAdmin: getUser?.isAdmin,
      i18n: this.i18n,
      ctx,
      text: getText?.text || 'Welcome',
      videos: getVideos,
    });
  }
}
