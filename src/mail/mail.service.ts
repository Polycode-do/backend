import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/User';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;
    console.log(process.env.GMAIL_USER, process.env.GMAIL_PASS);
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
