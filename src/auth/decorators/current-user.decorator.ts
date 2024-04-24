import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        console.log('user', request.user)
    return request.user ?? null;
  },
);
