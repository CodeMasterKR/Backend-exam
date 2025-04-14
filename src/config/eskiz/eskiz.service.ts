import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EskizService {
  private url = 'https://notify.eskiz.uz/api/';
  private token;
  private secret = '';
  private email = '';
  constructor() {
    this.auth();
  }

  async auth() {
    try {
      let { data: response } = await axios.post(`${this.url}/auth/login`, {
        email: this.email,
        password: this.secret,
      });
      this.token = response?.data?.token;
    } catch (error) {
      console.log(error);
    }
  }

  async sendSMS(message: any, phone: string){
    try {
        let { data: response } = await axios.post(`${this.url}/message/sms/send`, {
            mobile_phone: phone,
            password: message,
            from: 4546
          }, 
        {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
    } catch (error) {
        await this.auth();
        await this.sendSMS(message, phone);
        throw new BadRequestException(error)
    }
  }
}
