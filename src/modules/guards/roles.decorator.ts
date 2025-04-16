import { SetMetadata } from '@nestjs/common';
import { userRole } from '@prisma/client';

export const Roles = (...roles: userRole[]) => SetMetadata('roles', roles);