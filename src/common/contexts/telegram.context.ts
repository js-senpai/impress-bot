import { Scenes } from 'telegraf';
import { SceneSession, SceneSessionData } from 'telegraf/typings/scenes';
import { Context } from 'telegraf/typings/context';
export interface TelegramContext extends Scenes.SceneContext, Context {
  session: SceneSession<SceneSessionData> & {
    enableWritingText?: boolean;
    enableUploadingVideo?: boolean;
    enableMailing?: boolean;
    enableChoosingPeriod?: boolean;
  };
  startPayload?: any;
}
