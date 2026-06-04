import { AppModule } from './app/app.module';
import { autoNestServerGenerator } from 'asset/functions';

// 미들웨어 실행
(() => {
  try {
    require('../middleware');
    console.log('\n 🟢 미들웨어가 연결되었습니다.');
  } catch (e) {
    console.log(e);
    console.log('\n 🔴 미들웨어가 연결되지 않았습니다.');
  }
})();

// 서버 실행
autoNestServerGenerator(AppModule);
