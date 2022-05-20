import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { User, UserSession } from 'src/models/User';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectModel(UserSession)
    private userSessionModel: typeof UserSession,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByQuery({ email }, ['password']);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!(await compare(password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async validateSession(token: string) {
    const userSession = await this.userSessionModel.findOne({
      where: { token: Buffer.from(token, 'base64').toString('utf-8') },
      include: [{ model: User, required: true }],
    });

    if (!userSession || !userSession.user)
      throw new UnauthorizedException('Invalid session');

    return userSession.user;
  }

  async login(user: User) {
    const token = randomUUID();
    const expiresAt = new Date(
      Date.now() + (parseInt(process.env.JWT_LIFETIME_SECONDS) || 60) * 1000,
    );

    this.userSessionModel.create({
      token,
      userId: user.id,
      expiresAt,
    });

    const payload = {
      token: Buffer.from(token).toString('base64'),
      expiresAt,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: `${process.env.JWT_LIFETIME_SECONDS || 60}s`,
    });
  }

  async register(registerUserDto: RegisterUserDto) {
    const token = randomUUID();

    const user = await this.userService.findOneByQuery({
      email: registerUserDto.email,
    });

    if (user) throw new BadRequestException('User already exists');

    const createdUser = await this.userService.create(
      { ...registerUserDto },
      { emailToken: token },
    );

    await this.mailService.sendUserConfirmation(createdUser, token);

    return await this.login(createdUser);
  }
}
