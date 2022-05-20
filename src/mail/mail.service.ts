import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/User';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `${
      process.env.FRONTEND_URL || 'localhost:3000'
    }/confirm-email/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Polycode email confirmation',
      template: 'src/mail/templates/confirmation',
      context: {
        url,
      },
    });
  }
}
