import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const CheckAdminDecorator = () => {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    // Get original method
    const originalMethod = descriptor.value;
    // Check auth in original method
    descriptor.value = async function (data) {
      const { ctx } = data;
      const getId =
        ctx.update.message.from.id || ctx.update.callback_query.from.id;
      const getUser = await prisma.user.findUnique({
        where: {
          telegramId: getId,
        },
        select: {
          isAdmin: true,
        },
      });
      if (!getUser) {
        return;
      } else {
        return await originalMethod.call(this, data);
      }
    };
    return descriptor;
  };
};
