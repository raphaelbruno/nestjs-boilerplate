import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PermissionKey } from 'src/domain/models/enums/permission.enum';
import { User } from 'src/domain/models/user';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { PERMISSIONS_KEY } from 'src/presentation/decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from 'src/presentation/decorators/public.decorator';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenRepository: TokenRepositoryInterface,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) return true;
    if (!(await this.hasPermission(context))) throw new ForbiddenException();

    const request = context.switchToHttp().getRequest();
    request['user'] = await this.getUser(context);

    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async hasPermission(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionKey[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) return true;

    const user = await this.getUser(context);
    if (user.isSuperUser()) return true;

    const userPermissions = user.roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.key);

    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  private async getUser(context: ExecutionContext): Promise<User> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    return GenericMapper.getInstance(User).toModel(
      await this.verifyToken(token),
    );
  }

  private async verifyToken(token: string): Promise<any> {
    if (!token) throw new UnauthorizedException();

    try {
      return await this.tokenRepository.verify(token);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
