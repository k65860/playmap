import { Injectable } from '@nestjs/common';
import { send } from 'asset/functions';
import { TestDao } from './test.dao';
import { TestType, UserTest } from './test.interface';
import { WsService } from 'src/ws/ws.service';
import { CreateTestSubmitDto } from './test.dto';
import { ProfileDao } from 'src/profile/profile.dao';
import { CouponDao } from 'src/coupon/coupon.dao';
import { CharacterDao } from 'src/character/character.dao';
import { PlayDao } from 'src/play/play.dao';
import { Play } from 'src/play/play.interface';
import { Character } from 'src/character/character.interface';

@Injectable()
export class TestService {
  constructor(
    private readonly wsService: WsService,
    private readonly testDao: TestDao,
    private readonly profileDao: ProfileDao,
    private readonly couponDao: CouponDao,
    private readonly characterDao: CharacterDao,
    private readonly playDao: PlayDao,
  ) {}

  // 분석 종류 전체 조회
  public async getAllTestType() {
    const { data } = await this.testDao.getAllTestType();
    return send.success(data ?? []);
  }
  // 분석 결과 조회
  public async getAllUserTest(PRF_SQ: number) {
    const { data: profiles } = await this.profileDao.getOneProfile(PRF_SQ);
    if (!profiles?.length) throw Error('프로필이 존재하지 않아요.');

    const profile = profiles?.[0];
    const USR_SQ = profile?.USR_SQ;

    const { data: userTests } =
      await this.testDao.getAllUserTestByProfile(PRF_SQ);
    if (!userTests?.length) return send.success([]);

    const { data: userCoupons } = await this.couponDao.getAllUserCoupon(USR_SQ);

    const result = userTests?.map((item) => ({
      ...item,
      USE_CPN: !!userCoupons?.find((x) => x?.TEST_SQ === item?.TEST_SQ),
    }));

    return send.success(result);
  }

  private async getUserTest(TEST_SQ: number): Promise<UserTest> {
    const { data: userTests } = await this.testDao.getAllUserTest(TEST_SQ);
    if (!userTests?.length) throw Error('분석 결과가 존재하지 않아요.');

    const PRF_SQ = userTests?.[0]?.PRF_SQ;
    const TEST_TP_SQ = userTests?.[0]?.TEST_TP_SQ;

    const { data: testTypes } = await this.testDao.getAllTestType(TEST_TP_SQ);
    if (!testTypes?.length) throw Error('분석 종류가 존재하지 않아요.');

    // TODO: 추 후 다른 테스트 종류가 생길 경우 로직 수정 필요
    const testType = testTypes?.[0];

    const { data: profiles } = await this.profileDao.getOneProfile(PRF_SQ);
    if (!profiles?.length) throw Error('프로필이 존재하지 않아요.');

    const profile = profiles?.[0];
    const USR_SQ = profile?.USR_SQ;

    const { data: userCoupons } = await this.couponDao.getAllUserCoupon(USR_SQ);

    const results: UserTest[] = userTests?.map((item) => ({
      ...item,
      USE_CPN: !!userCoupons?.find((x) => x?.TEST_SQ === item?.TEST_SQ),
    }));

    // 각 분석 카테고리 별 점수 조회
    const { data: testCategories } =
      await this.testDao.getAllUserTestResult(TEST_SQ);

    let testCategoryResult = testCategories?.map((x) => ({
      ...x,
      TEST_CTGR_PNT: Number(x?.TEST_CTGR_PNT ?? 0),
    }));

    const CATEGORY = [...testCategoryResult];

    testCategoryResult = testCategoryResult?.sort(
      (a, b) => b?.TEST_CTGR_PNT - a?.TEST_CTGR_PNT,
    );

    // 캐릭터 조회
    const { data: characterStandard } =
      await this.characterDao.getAllCharacterStandard();
    const { data: characters } = await this.characterDao.getAllCharacter();

    let characterResults: Character[] = characters?.map((item) => {
      let CHAR_PNT = 0;
      const TEST_CTGR_SQ_LIST = characterStandard
        ?.filter((x) => x?.CHAR_SQ === item?.CHAR_SQ)
        ?.map((x) => x?.TEST_CTGR_SQ);

      testCategoryResult?.forEach(({ TEST_CTGR_SQ, TEST_CTGR_PNT }) => {
        if (TEST_CTGR_SQ_LIST?.includes(TEST_CTGR_SQ)) {
          CHAR_PNT += TEST_CTGR_PNT ?? 0;
        }
      });
      return { ...item, CHAR_PNT };
    });

    characterResults = characterResults?.sort(
      (a, b) => b?.CHAR_PNT - a?.CHAR_PNT,
    );

    const firstCharacterPoint = characterResults?.[0]?.CHAR_PNT ?? 0;
    const characterResult = characterResults?.filter(
      (x) => x?.CHAR_PNT === firstCharacterPoint,
    );

    // 놀이유형 조회
    const { data: playStandard } = await this.playDao.getAllPlayStandard();
    const { data: plays } = await this.playDao.getAllPlay();

    let playResults: Play[] = plays?.map((item) => {
      let PLAY_PNT = 0;
      const TEST_CTGR_SQ_LIST = playStandard
        ?.filter((x) => x?.PLAY_SQ === item?.PLAY_SQ)
        ?.map((x) => x?.TEST_CTGR_SQ);

      testCategoryResult?.forEach(({ TEST_CTGR_SQ, TEST_CTGR_PNT }) => {
        if (TEST_CTGR_SQ_LIST?.includes(TEST_CTGR_SQ)) {
          PLAY_PNT += TEST_CTGR_PNT ?? 0;
        }
      });
      return { ...item, PLAY_PNT };
    });

    playResults = playResults?.sort((a, b) => b?.PLAY_PNT - a?.PLAY_PNT);

    const firstPlayPoint = playResults?.[0]?.PLAY_PNT ?? 0;
    const playResult = playResults?.filter(
      (x) => x?.PLAY_PNT === firstPlayPoint,
    );

    // 분석 결과 캐릭터 저장
    await this.testDao.updateTestCharactor(
      TEST_SQ,
      characterResult?.[0]?.CHAR_SQ,
    );

    const result: UserTest = {
      ...results?.[0],
      TEST_TP_NM: testType?.TEST_TP_NM,
      TEST_TP_CN: testType?.TEST_TP_CN,
      TEST_TP_MAX_PNT: testType?.TEST_TP_MAX_PNT,
      CATEGORY: CATEGORY,
      CHARACTER: characterResult?.sort((a, b) => b?.CHAR_PNT - a?.CHAR_PNT),
      PLAY: playResult?.sort((a, b) => b?.PLAY_PNT - a?.PLAY_PNT),
    };

    return result;
  }

//  분석 결과 조회
//   public async getOneUserTest(TEST_SQ: number, IS_ADM: number = 0) {
//     const userTest = await this.getUserTest(TEST_SQ);
//
//     // 사용한 쿠폰이 있다면..
//     if (IS_ADM || userTest?.USE_CPN) return send.success(userTest);
//
//     const { PLAY, ...result } = userTest;
//     return send.success(result);
//   }

  // 분석 결과 상세 조회
  public async getOneUserTest(TEST_SQ: number, IS_ADM: number = 0) {
    const userTest = await this.getUserTest(TEST_SQ);
    const {
      CHARACTER,
      PLAY,
      CATEGORY,
      USE_CPN,
      TEST_SQ: test_sq,
      PRF_SQ,
      TEST_TP_SQ,
      TEST_TP_NM,
      TEST_TP_CN,
      TEST_TP_MAX_PNT,
      TEST_RVW,
      CRT_DT,
      MOD_DT,
      DEL_DT,
      USR_SQ,
    } = userTest;

    if (!CHARACTER?.length || !PLAY?.length) {
      throw Error('분석 결과가 부족합니다.');
    }

    const character = CHARACTER[0];
    const play = PLAY[0];

    const result = {
      //  응답에 포함되어야 할 메타정보
      TEST_SQ: test_sq,
      TEST_TP_SQ,
      PRF_SQ,
      TEST_RVW,
      CHAR_SQ: character.CHAR_SQ,
      CRT_DT,
      MOD_DT,
      DEL_DT,
      USR_SQ,
      USE_CPN,
      TEST_TP_NM,
      TEST_TP_CN,
      TEST_TP_MAX_PNT,
      CATEGORY,
      CHARACTER,
      PLAY,

      // 슬라이드 구성 데이터
      TEMPERAMENT: {
        CHAR_SQ: character.CHAR_SQ,
        CHAR_NM: character.CHAR_NM,
        CHAR_STDD: character.CHAR_STDD,
        CHAR_DESC: character.CHAR_DESC,
        CHAR_STRONG: character.CHAR_STRONG,
        CHAR_WEAK: character.CHAR_WEAK,
        CHAR_IMG_PATH: character.CHAR_IMG_PATH,
        CHAR_BGM_PATH: character.CHAR_BGM_PATH,
      },

      PLAY_TYPE_DETAIL: {
        PLAY_STDD: play.PLAY_STDD,
        PLAY_DESC: play.PLAY_DESC,
        PLAY_EPNTN: play.PLAY_EPNTN,
        PLAY_PARENTS_MSG: play.PLAY_PARENTS_MSG,
      },

      PLAY_TYPE_SUMMARY: {
        PLAY_FEAT: play.PLAY_FEAT,
        PLAY_STRONG: play.PLAY_STRONG,
        PLAY_WEAK: play.PLAY_WEAK,
      },

      SOLUTIONS: {
        ACTIVITY: {
          home: play.PLAY_HOME,
          home_img: play.PLAY_HOME_IMG_PATH,
          with_parents: play.PLAY_PARENTS,
          with_parents_img: play.PLAY_PARENTS_IMG_PATH,
        },
        GUIDE: {
          guide_text: play.PLAY_GUIDE,
          guide_img: play.PLAY_GUIDE_IMG_PATH,
        },
        LEARNING: {
          sports: play.PLAY_SPORTS,
          sports_img: play.PLAY_SPORTS_IMG_PATH,
          study: play.PLAY_LEARN,
          study_img: play.PLAY_LEARN_IMG_PATH,
        },
      },
    };

    // 쿠폰 미사용자는 일부 필드 제한 가능
    if (IS_ADM || USE_CPN) return send.success(result);

    const { SOLUTIONS, ...partial } = result;
    return send.success(partial);
  }



  // 분석 결과에 쿠폰 사용
  public async execUserTestUseCoupon(TEST_SQ: number) {
    const userTest = await this.getUserTest(TEST_SQ);
    const { USR_SQ, USE_CPN } = userTest;

    if (!USR_SQ) throw Error('사용자가 존재하지 않아요.');

    // 쿠폰 이미 사용 유무 판정
    if (USE_CPN) return send.success(userTest);

    // 쿠폰 보유 유무 판정
    const { data: userTotalCoupons } =
      await this.couponDao.getAllUserCoupon(USR_SQ);
    const userPossibleCoupons = userTotalCoupons?.filter((x) => !x?.USE_CPN_SQ);

    if (!userPossibleCoupons?.length) throw Error('쿠폰이 존재하지 않아요.');

    const { USR_CPN_SQ } = userPossibleCoupons?.sort(
      (a, b) => a?.USR_CPN_SQ - b?.USR_CPN_SQ,
    )?.[0];

    // 쿠폰 사용 처리
    await this.couponDao.createUseCoupon(USR_CPN_SQ, TEST_SQ);

    this.wsService.execAllSend('/api/test/' + TEST_SQ);
    this.wsService.execAllSend('/api/coupon?USR_SQ=' + USR_SQ);

    const RMN_USR_CPN_CNT = userPossibleCoupons?.length - 1;
    return send.success({ RMN_USR_CPN_CNT });
  }

  // 분석 결과에 리뷰 작성
  public async createUserTestReview(TEST_SQ: number, TEST_RVW: string) {
    const { data: tests } = await this.testDao.getAllUserTest(TEST_SQ);

    if (!tests?.length) throw Error('분석 결과가 존재하지 않아요.');

    await this.testDao.createUserTestReview(TEST_SQ, TEST_RVW);

    this.wsService.execAllSend('/api/test/' + TEST_SQ);

    return send.success();
  }
}
