import { AuthGuard } from '@nestjs/passport';

export class LoaclAuthGuard extends AuthGuard('local') {}
