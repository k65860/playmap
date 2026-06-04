import { Injectable } from '@nestjs/common';
import config from 'asset/config';
import { createTransport } from 'nodemailer';

const from = `${config.MAIL.NAME} <${config.MAIL.USER}>`;
const transporter = createTransport({
  host: config.MAIL.HOST,
  port: config.MAIL.PORT,
  auth: {
    user: config.MAIL.USER,
    pass: config.MAIL.PASSWORD,
  },
});

@Injectable()
export class MailService {
  constructor() {}

  /** 이메일 전송 */
  public async send(
    to: string,
    subject: string,
    _html: string,
  ): Promise<boolean> {
    let isSuccess = false;

    const html = `
      <style>
        * {margin: 0;padding: 0;box-sizing: border-box;}
      </style>
      <main style="padding: 20px;">
        <h1 style="
          border-top: 6px solid #0080ff;
          padding: 16px;
          font-size: 22px;
        ">
          [${config.MAIL.NAME}] ${subject}
        </h1>
        <div style="
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          padding: 30px 16px;
        ">
          <h2 style="
            font-size: 16px;
            margin-bottom: 5px;
          ">
            회원님 안녕하세요.
          </h2>
          <p style="
            line-height: 20px;
            color: #777;
            font-size: 14px;
            margin-bottom: 50px;
          ">
            <string>${config.MAIL.NAME}</strong>을 이용해 주셔서 진심으로 감사 드립니다.<br />
            ${_html}
            <div>
              <a style="
                  font-size: 14px;
                  display: inline-block;
                  margin-top: 40px;
                  border: none;
                  padding: 10px 12px;
                  cursor: pointer;
                  color: #fff;
                  background-color: #0080ff;
                  border-radius: 5px;
                  letter-spacing: 1px;
                  text-decoration: none;
                " 
                href="http${config.SERVER.USE_SSL ? 's' : ''}://${config.SERVER.DOMAIN}"
                target="_blank"
              >
                PLAYMAP 이동
              </a>
            </div>
          </p>
        </div>
      </main>
    `;

    try {
      await transporter.sendMail({ from, to, subject, html });
      isSuccess = true;
    } catch (e) {
      isSuccess = false;
    } finally {
      return isSuccess;
    }
  }
}
