import { Injectable } from '@nestjs/common';
import { GptDao } from './gpt.dao';
import { CreateGptDto } from './gpt.dto';
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai';
import { send } from 'asset/functions';
import { WsService } from 'src/ws/ws.service';

@Injectable()
export class GptService {
  constructor(
    private readonly gptDao: GptDao,
    private readonly wsService: WsService,
  ) {}

  public async getAllGptKeyword() {
    const { data } = await this.gptDao.getAllGptKeyword();
    const result: string[][] = [];
    const temp: string[][] = [];

    data?.forEach((item) => {
      if (!temp[item?.GPT_KWD_ODR]) temp[item?.GPT_KWD_ODR] = [];
      temp[item?.GPT_KWD_ODR]?.push(item?.GPT_KWD_CN);
    });

    temp?.forEach((item) => {
      if (item?.length) result.push(item);
    });

    return send.success(result);
  }

  public async getAllGpt(PRF_SQ: number) {
    const { data } = await this.gptDao.getAllGpt(PRF_SQ);
    return send.success(data ?? []);
  }

  public async createGpt({
    PRF_SQ,
    GPT_REF_CN,
    GPT_CN: content,
  }: CreateGptDto) {
    await this.gptDao.createGpt(PRF_SQ, 1, content);

    const { data: gptConfig } = await this.gptDao.getGptToken();

    this.wsService.execAllSend('/gpt?PRF_SQ=' + PRF_SQ);

    const apiKey = gptConfig?.[0]?.SET_VAL;
    const organization = gptConfig?.[1]?.SET_VAL;
    content = GPT_REF_CN + ' ' + content;

    const configuration = new Configuration({ apiKey, organization });
    const openai = new OpenAIApi(configuration);
    const form: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content }],
    };

    // ! 동기
    // const { data } = await openai.createChatCompletion(form);
    // const GPT_CN = data?.choices?.[0]?.message?.content;
    // if (!GPT_CN) throw Error('GPT 응답이 없어요.');

    // await this.gptDao.createGpt(PRF_SQ, 2, GPT_CN);
    // this.wsService.execAllSend('/gpt?PRF_SQ=' + PRF_SQ);

    // ! 비동기
    openai
      .createChatCompletion(form)
      .then(async ({ data }) => {
        const GPT_CN = data?.choices?.[0]?.message?.content;
        if (!GPT_CN) return;

        await this.gptDao.createGpt(PRF_SQ, 2, GPT_CN);
      })
      .catch(() => {})
      .finally(() => {
        this.wsService.execAllSend('/gpt?PRF_SQ=' + PRF_SQ);
      });

    return send.success();
  }

  public async deleteGpt(GPT_SQ: number) {
    await this.gptDao.deleteGpt(GPT_SQ);
    return send.success();
  }
}
