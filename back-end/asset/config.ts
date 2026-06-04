const config = {
  DEFAULT: {
    NAME: 'PLAYMAP',
    DESCRIPTION: 'PLAYMAP REST API 서버',
    VERSION: '1.0.0',
  },
  CONTACT: {
    NAME: 'Developer',
    EMAIL: 'jsw9330@icloud.com',
    LICENSE: '',
    LICENCE_URL: '/public/licence.md',
  },
  STATIC_PATH: [
    { serveRoot: '/upload', rootPath: __dirname + '/../../upload' },
    { serveRoot: '/public', rootPath: __dirname + '/../../public' },
    {
      renderPath: '*',
      rootPath: __dirname + '/../../view',
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
    },
  ],
  PAYMINT: {
    ERROR: {
      '1010': '미신청 상태 또는 심사중입니다.',
      '1206': '20,000원 이상 금액만 청구 가능합니다.',
      '1020': 'API KEY 정보를 확인할 수 없습니다.',
      '9999': '실패 하였습니다.',
      '9971': '이미 결제된 청구서입니다.',
      '9800': '이미 사용된 청구서 코드입니다.',
      '9980': '청구서가 존재하지 않습니다.',
      '9870': 'Callback URL에 오류가 발생하였습니다.',
      '5000': '시스템에서 오류가 발생하였습니다.',
      '1003': '대상자 정보가 없습니다.',
      '1201': '발송톡 수량이 없습니다.',
      '1205': '청구금액은 100원 이상이어야 합니다.',
    },
  },
  SERVER: {
    HOST: '139.150.69.140',
    DOMAIN: 'playmap.한국',
    PORT: {
      HTTP: { DEV: 80, PROD: 80 },
      HTTPS: { DEV: 443, PROD: 443 },
      WS: 10000,
      WSS: 10001,
    },
    USE_WS: true,
    USE_SSL: false,
    TIMEOUT: 10_000,
    LOG_LEVEL: ['warn', 'verbose', 'fatal', 'error', 'debug'],
    API: {
      BASE_PATH: '/api',
      DOCUMENT: {
        PATH: '/api',
        CSS_PATH: '/public/document.css',
        FAVICON_PATH: '/public/favicon.png',
      },
    },
  },
  DB: {
    HOST: { DEV: '139.150.69.140', PROD: '10.27.15.5' },
    USER: 'dev',
    PASSWORD: 'fldks123!@#',
    PORT: 3306,
    NAME: 'dev',
    TIMEOUT: 10_000,
  },
  JWT: {
    COOKIE_NAME: 'PLAYMAP_TOKEN',
    SECRET: 'LIAN_PLAYMAP',
    EXPIRE: '1d',
  },
  MAIL: {
    HOST: 'smtp.gmail.com',
    PORT: 587,
    USER: 'jsw93300@gmail.com',
    PASSWORD: 'bfho tbvn vhxt vibz',
    NAME: 'PLAYMAP',
  },
  FORMAT: {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    DATETIME_MS: 'YYYY-MM-DD HH:mm:ss.SSS',
  },
  SNS_LOGIN_TYPE: ['SNS_KAKAO'],
} as const;

export default config;
