import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import { LoggerService, type INestApplication } from '@nestjs/common';
import { loggerMiddleware } from 'src/app/app.middleware';
import { existsSync, mkdirSync } from 'fs';
import { ParamsPipe } from 'src/app/app.pipe';
import { json } from 'express';
import { Server } from 'http';
import config from './config';
import { NestFactory } from '@nestjs/core';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  AuthFilter,
  BadRequestFilter,
  NotFoundFilter,
  ServerErrorFilter,
} from 'src/app/app.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import { Connection, ConnectionOptions, createConnection } from 'mysql2';

const nets = os.networkInterfaces();
require('dotenv').config();

// ! 응답 메시지 생성
export const send = {
  error: (message: string = '에러가 발생했어요.') => ({
    result: false,
    message,
    body: null,
  }),
  success: <T = any>(body: T = null) => ({
    result: true,
    message: '성공',
    body,
  }),
};

// ! 정적 경로 생성
const createStaticPath = () => {
  config.STATIC_PATH.forEach(({ rootPath }) => {
    const isExist = existsSync(rootPath);
    if (isExist) return;
    setTimeout(() => console.log('디렉토리를 생성하였습니다.'), 1000);

    mkdirSync(rootPath, { recursive: true });
  });
};

// ! API 문서 생성
const createApiDocument = (app: INestApplication<any>) => {
  const cookieAuthOptions: SecuritySchemeObject = {
    type: 'apiKey',
    bearerFormat: 'JWT',
  };
  const docsConfig = new DocumentBuilder()
    .setTitle(config.DEFAULT.NAME + ' RESTFul API 정의서')
    .setVersion(config.DEFAULT.VERSION)
    .setLicense(config.CONTACT.LICENSE, config.CONTACT.LICENCE_URL)
    .setContact(config.CONTACT.NAME, undefined, config.CONTACT.EMAIL)
    .setDescription(
      '<a href="https://www.figma.com/design/skcfzPCv2CjoKD6cLgc8uH/%ED%94%8C%EB%A0%88%EC%9D%B4%EB%A7%B5?node-id=0-1&t=TtNwwnWuXybKV189-1" target="_blank">디자인 링크</a>',
    )
    .addServer(config.SERVER.API.BASE_PATH, 'HTTP 서버')
    .addCookieAuth(config.JWT.COOKIE_NAME, cookieAuthOptions)
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  const customSiteTitle = config.DEFAULT.NAME + ' REST API 정의서';
  const customfavIcon = config.SERVER.API.DOCUMENT.FAVICON_PATH;
  const customCssUrl = config.SERVER.API.DOCUMENT.CSS_PATH;
  const options: SwaggerCustomOptions = {
    customSiteTitle,
    customfavIcon,
    customCssUrl,
  };
  SwaggerModule.setup(config.SERVER.API.DOCUMENT.PATH, app, document, options);
};

// ! NestJS 서버 기본 설정 및 가동
const serverSetup = async (app: INestApplication<any>) => {
  app.setGlobalPrefix(config.SERVER.API.BASE_PATH);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,POST,PATCH,PUT,DELETE',
  });
  app.useGlobalFilters(
    new ServerErrorFilter(),
    new BadRequestFilter(),
    new NotFoundFilter(),
    new AuthFilter(),
  );
  app.use(loggerMiddleware);
  app.use(cookieParser());
  app.use(json({ limit: '1000mb' }));
  app.useGlobalPipes(new ParamsPipe({ transform: true }));
  app.useWebSocketAdapter(new WsAdapter(app));

  const server: Server = app.getHttpServer();
  server.setTimeout(config.SERVER.TIMEOUT);

  const MODE = process.env.NODE_ENV === 'DEVELOPMENT' ? 'DEV' : 'PROD';
  await app.listen(config.SERVER.PORT.HTTP[MODE], '0.0.0.0');
};

// ! 서버 시작 로그 생성
const serverStartLog = () => {
  const type = process.env.NODE_ENV === 'DEVELOPMENT' ? '개발' : '운영';

  const getMargin = (text: string): string => {
    return ' '.repeat(40 - 1 - text?.length);
  };

  const HOST = 'localhost';
  const HTTP_PORT = config.SERVER.PORT.HTTP.DEV;
  const WS_PORT = config.SERVER.PORT.WS;

  let HTTP_SERVER = ` http://${HOST}:${HTTP_PORT}`;
  HTTP_SERVER += getMargin(HTTP_SERVER);
  let WS_SERVER = ` ws://${HOST}:${WS_PORT}`;
  WS_SERVER += getMargin(WS_SERVER);
  let API_DOCUMENT = ` http://${HOST}:${HTTP_PORT}/api`;
  API_DOCUMENT += getMargin(API_DOCUMENT);

  let table = '';
  table += `\n ╒═══╤══════════════╤════════════════════════════════════════╕`;
  table += `\n │   │ TITLE        │ URL                                    │`;
  table += `\n ╞═══╪══════════════╪════════════════════════════════════════╡`;
  table += `\n │ ◼︎ │ HTTP SERVER  │ ${HTTP_SERVER}│`;
  table += `\n ├───┼──────────────┼────────────────────────────────────────┤`;
  table += `\n │ ◼︎ │ WS SERVER 1  │ ${WS_SERVER}│`;
  table += `\n ├───┼──────────────┼────────────────────────────────────────┤`;
  table += `\n │ ◼︎ │ DOCUMENT     │ ${API_DOCUMENT}│`;
  table += `\n └───┴──────────────┴────────────────────────────────────────┘`;
  table += `\n ✅ ${type}모드 서버 동작`;

  console.log(table);

  let ip: string = '';
  for (const name of Object.keys(nets)) {
    nets[name]?.forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        ip = net.address;
      }
    });
  }
  const msg = `\n ✅ 내부 IP는 ${ip} 입니다.`;
  console.log(msg);
};

/**
 * @name 자동 서버 생성 & 실행
 * @param startModule - 시작 모듈
 * @example
 * import { AppModule } from './app.module';
 * import { autoNestServerGenerator } from 'asset/functions';
 *
 * autoNestServerGenerator(AppModule);
 */
export const autoNestServerGenerator = async (startModule: any) => {
  const logger = config.SERVER.LOG_LEVEL as unknown as LoggerService;
  const app = await NestFactory.create(startModule, { logger });

  createApiDocument(app);
  await serverSetup(app);
  createStaticPath();
  serverStartLog();
};

export const db = <T = any>(
  query: string,
  params?: (number | string)[],
): Promise<{ result: boolean; data: T }> => {
  const MODE = process.env.NODE_ENV === 'DEVELOPMENT' ? 'DEV' : 'PROD';

  const options: ConnectionOptions = {
    host: config.DB.HOST[MODE],
    user: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.NAME,
    port: config.DB.PORT,
    connectTimeout: config.DB.TIMEOUT,
    multipleStatements: true,
    dateStrings: true,
  };

  return new Promise((resolve) => {
    let conn: Connection;

    try {
      conn = createConnection(options);
      conn.on('error', () => {});
      conn.query(query, params, (e, result) => {
        conn.end();
        if (e) {
          console.error(e?.message);
          return resolve({ result: false, data: result as T });
        }
        return resolve({ result: true, data: result as T });
      });
    } catch {
      return resolve({ result: false, data: null });
    }
  });
};
