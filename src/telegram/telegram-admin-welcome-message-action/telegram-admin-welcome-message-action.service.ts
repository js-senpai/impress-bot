import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { TelegramContext } from '../../common/contexts/telegram.context';
import { MenuAction } from '../../common/components/telegram/actions/admin/common/menu.action';
import { I18nService } from 'nestjs-i18n';
import { CheckAdminDecorator } from '../../common/decorators/check-admin.decorator';
import { WriteTextAction } from '../../common/components/telegram/actions/admin/text/write-text.action';
import { ITelegramBodyWithMessage } from '../../common/interfaces/telegram.interface';
import { SuccessTextChangedAction } from '../../common/components/telegram/actions/success/success-text-changed.action';
import { UploadNewVideoAction } from '../../common/components/telegram/actions/admin/video/upload-new-video.action';
import { ErrorFileSizeAction } from '../../common/components/telegram/actions/errors/error-file-size.action';
import { TelegramFileService } from '../../common/services/telegram-file.service';
import * as fs from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { SuccessVideoUploadedAction } from '../../common/components/telegram/actions/success/success-video-uploaded.action';
import { DeleteVideosAction } from '../../common/components/telegram/actions/admin/video/delete-videos.action';
import { ErrorVideoNotFoundAction } from '../../common/components/telegram/actions/errors/error-video-not-found.action';
import { SuccessVideoDeletedAction } from '../../common/components/telegram/actions/success/success-video-deleted.action';
import { GetVideosMenuAction } from '../../common/components/telegram/actions/admin/video/get-videos-menu.action';

@Injectable()
export class TelegramAdminWelcomeMessageActionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly telegramFileService: TelegramFileService,
  ) {}

  @CheckAdminDecorator()
  async cancel({ ctx }: { ctx: TelegramContext }) {
    const { session } = ctx;
    session.enableUploadingVideo = false;
    session.enableWritingText = false;
    session.enableMailing = false;
    return await MenuAction({
      ctx,
      i18n: this.i18n,
    });
  }

  @CheckAdminDecorator()
  async enableWritingText({ ctx }: { ctx: TelegramContext }) {
    const { session } = ctx;
    await WriteTextAction({
      ctx,
      i18n: this.i18n,
    });
    session.enableWritingText = true;
    return;
  }

  @CheckAdminDecorator()
  async updateText({ ctx, message }: ITelegramBodyWithMessage) {
    const { session } = ctx;
    const checkText = await this.prismaService.welcomeText.findFirst({
      select: {
        id: true,
      },
    });
    if (!checkText) {
      await this.prismaService.welcomeText.create({
        data: {
          text: message,
        },
      });
    } else {
      await this.prismaService.welcomeText.update({
        where: {
          id: checkText.id,
        },
        data: {
          text: message,
        },
      });
    }
    session.enableWritingText = false;
    return await SuccessTextChangedAction({
      ctx,
      i18n: this.i18n,
    });
  }

  @CheckAdminDecorator()
  async getVideosMenu({ ctx }: { ctx: TelegramContext }) {
    return await GetVideosMenuAction({
      ctx,
      i18n: this.i18n,
    });
  }

  @CheckAdminDecorator()
  async enableUploadingVideo({ ctx }: { ctx: TelegramContext }) {
    const { session } = ctx;
    await UploadNewVideoAction({
      ctx,
      i18n: this.i18n,
    });
    session.enableUploadingVideo = true;
    return;
  }

  @CheckAdminDecorator()
  async createNewVideo({ ctx }: { ctx: TelegramContext }) {
    const {
      session,
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: { video = {} },
      },
    } = ctx;
    const { mime_type, file_id, file_size, file_name } = video;
    if (file_size > 20 * 1024 * 1024) {
      session.enableUploadingVideo = false;
      return await ErrorFileSizeAction({
        ctx,
        i18n: this.i18n,
      });
    }
    const uniqueName = nanoid(3);
    const fileName = `${uniqueName}_${file_name}`;
    const writeStream = fs.createWriteStream(
      join(__dirname, '..', '..', '..', 'videos', fileName),
    );
    const { file } = await this.telegramFileService.get({
      mimeType: mime_type,
      fileId: file_id,
      ctx,
    });
    file.pipe(writeStream);
    await this.prismaService.welcomeVideos.create({
      data: {
        fileName,
        uniqueName,
      },
    });
    session.enableUploadingVideo = false;
    return await SuccessVideoUploadedAction({
      ctx,
      i18n: this.i18n,
    });
  }

  @CheckAdminDecorator()
  async getDeleteVideoList({ ctx }: { ctx: TelegramContext }) {
    return await DeleteVideosAction({
      ctx,
      i18n: this.i18n,
      videos: await this.prismaService.welcomeVideos.findMany({
        select: {
          fileName: true,
          uniqueName: true,
        },
      }),
    });
  }

  @CheckAdminDecorator()
  async acceptDeleteVideo({
    ctx,
    uniqueName,
  }: {
    ctx: TelegramContext;
    uniqueName: string;
  }) {
    const {
      update: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback_query: {
          message: { message_id, chat },
        },
      },
    } = ctx;
    const getVideo = await this.prismaService.welcomeVideos.findUnique({
      where: {
        uniqueName,
      },
      select: {
        fileName: true,
      },
    });
    if (!getVideo) {
      return await ErrorVideoNotFoundAction({
        ctx,
        i18n: this.i18n,
      });
    }
    const videoPath = join(
      __dirname,
      '..',
      '..',
      '..',
      'videos',
      getVideo.fileName,
    );
    const checkIfExist = fs.existsSync(videoPath);
    if (!checkIfExist) {
      return await ErrorVideoNotFoundAction({
        ctx,
        i18n: this.i18n,
      });
    }
    await fs.promises.unlink(videoPath);
    await this.prismaService.welcomeVideos.delete({
      where: {
        uniqueName,
      },
    });
    return await SuccessVideoDeletedAction({
      ctx,
      i18n: this.i18n,
      chatId: chat.id,
      messageId: message_id,
    });
  }
}
