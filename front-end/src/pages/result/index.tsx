import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../../layouts/button";
import { alert, http } from "../../assets/functions";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import {
  getCouponListAtom,
  settingAtom,
  testHistoryListAtom,
  userAtom,
} from "../../assets/atoms";
import TestResult from "./testResult";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import AudiotrackRoundedIcon from "@mui/icons-material/AudiotrackRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import Title from "../../components/title";
import ReviewModal from "./review-modal";
import colors from "../../assets/colors";
import Guide from "../../components/guide";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

export default () => {
  const nav = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useRecoilValue(userAtom);
  const setting = useRecoilValue(settingAtom);
  const testHistory = useRecoilValue(testHistoryListAtom);
  const getCouponList = useRecoilValue(getCouponListAtom);
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false);
  const [reviewValue, setReviewValue] = useState<string>("");
  const [isReviewAlert, setReviewAlert] = useState<number>(-1);
  const BGM_AUDIO_REF = useRef<HTMLAudioElement>(null);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [bgmPath, setBgmPath] = useState<string>("");

  const prfSq = useMemo(() => {
    return Number(sessionStorage.getItem("PRF_SQ") ?? 0);
  }, [sessionStorage.getItem("PRF_SQ")]);

  // ! 마지막 TEST_SQ
  const lastTestSq = useMemo(() => {
    return testHistory?.[0]?.TEST_SQ;
  }, [testHistory]);

  // ! 적용할 TEST_SQ
  const targetTestSq: number = useMemo(() => {
    const query = location?.state?.TEST_SQ;
    return query ? query : lastTestSq;
  }, [lastTestSq, location?.state?.TEST_SQ]);

  const { data: profiles = [] } = useQuery<Common.Profile[]>(
    ["/profile", user?.USR_SQ],
    async () => {
      const { data } = await http.get("/profile", {
        params: { USR_SQ: user?.USR_SQ },
      });
      return data?.body ?? [];
    },
    { enabled: !!user?.USR_SQ }
  );

  const {
    data: result = null,
    isLoading: resultLoading,
    refetch,
  } = useQuery<Test.HistoryDetail>(
    [`/test/${targetTestSq}`],
    async () => {
      if (!targetTestSq) return null;
      const { data } = await http.get(`/test/${targetTestSq}`);
      if (!data?.result) return alert.error(data?.message);
      return data?.body ?? null;
    },
    { enabled: !!targetTestSq }
  );

  useQuery(
    [`isTestSq`, prfSq],
    async () => {
      const { data } = await http.get(`/test?PRF_SQ=${prfSq}`);
      if (!data?.result) return alert.error(data?.message);
      if (data?.body?.length === 0) {
        nav("/test/choice");
      }
    },
    { enabled: !!prfSq }
  );

  const { mutate: useCoupon, isLoading: couponUseLoading } = useMutation(
    async () => {
      const ask = window.confirm(
        "쿠폰을 사용하여 분석결과를 상세하게 보시겠어요?"
      );
      if (!ask) return;
      if (!currentCouponCount) return nav("/buycoupon");

      const { data } = await http.post(`/test/${targetTestSq}`);
      if (!data?.result) return alert.error(data?.message);
      refetch();
      queryClient.invalidateQueries(`/coupon?USR_SQ=${user?.USR_SQ}`);
      alert.success("적용되었어요.");
    }
  );

  const profileName = useMemo<string>(() => {
    const find = profiles?.find((x) => x?.PRF_SQ === prfSq);
    return find?.PRF_NM || "";
  }, [profiles, prfSq]);

  const currentCouponCount = useMemo(() => {
    return getCouponList?.filter((x) => !x?.USE_CPN_SQ)?.length;
  }, [getCouponList]);

  // ! 카카오톡 공유
  const kakaoShare = () => {
    const { protocol, host } = window.location;
    const url = `${protocol}//${host}/sharepage?testsq=${targetTestSq}`;
    const imageUrl = `${protocol}//${host}/public/logo.png`;
    const mobileWebUrl = url;
    const webUrl = url;

    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: profileName + "님 분석결과",
        description: "우리 아이 기질 분석의 캐릭터는..?",
        link: { mobileWebUrl, webUrl },
        imageUrl,
      },
      buttons: [
        { title: "상세보기", link: { mobileWebUrl, webUrl } },
        {
          title: "플레이맵",
          link: {
            mobileWebUrl: `${protocol}//${host}`,
            webUrl: `${protocol}//${host}`,
          },
        },
      ],
      installTalk: true,
    });
  };

  // ! 밸런스플레이 알아보기
  const openOfflineReserveURL = () => {
    const url = setting?.find((x) => x?.SET_GRP === "RESERVATION_URL")?.SET_VAL;
    if (!url) return alert.error("URL이 없어요.");
    window.open(url);
  };

  const stopBgm = () => {
    if (!BGM_AUDIO_REF.current) return;
    BGM_AUDIO_REF.current?.pause();
  };

  const playBgm = () => {
    stopBgm();

    if (!BGM_AUDIO_REF.current) return;
    BGM_AUDIO_REF.current?.play();
  };

  useEffect(() => {
    if (!BGM_AUDIO_REF.current) return;
    BGM_AUDIO_REF.current.volume = 0.5;

    if (bgmPath) {
      BGM_AUDIO_REF.current?.play();
    } else {
      BGM_AUDIO_REF.current?.pause();
    }
  }, [bgmPath]);

  useEffect(() => {
    const listEnd = document.querySelector("#bottom-buttons"); // 관찰할 대상(요소)
    const options = {
      root: null, // 뷰포트를 기준으로 타켓의 가시성 검사
      rootMargin: "0px 0px 0px 0px", // 확장 또는 축소 X
      threshold: 0, // 타켓의 가시성 0%일 때 옵저버 실행
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 관찰 대상이 화면에 들어왔을 때
          setReviewAlert((x) => {
            if (x === -1) return 0;
            return 1;
          });
        }
      });
    }, options);
    observer.observe(listEnd!);
  }, []);

  useEffect(() => {
    if (isReviewAlert < 1 || reviewValue) return;

    setIsReviewModal(true);
  }, [isReviewAlert, reviewValue]);

  useEffect(() => {
    if (!result) return;
    setReviewValue(result?.TEST_RVW ?? "");
  }, [result?.TEST_RVW]);

  useEffect(() => {
    if (!prfSq) nav("/profile");
  }, [prfSq]);

  return (
    <>
      <audio
        ref={BGM_AUDIO_REF}
        src={bgmPath}
        onPlay={() => setPlay(true)}
        onPause={() => setPlay(false)}
        onError={() => {}}
      />
      <Title
        title="최근 분석 결과"
        right={
          <Row>
            <Button
              loading={resultLoading}
              onClick={isPlay ? stopBgm : playBgm}
              backgroundColor={
                resultLoading ? "gray" : isPlay ? "red" : "green"
              }
            >
              BGM {isPlay ? "OFF" : "ON"}
            </Button>
            <IconTouchable onClick={() => nav("/myInfo")}>
              <AccountCircleRoundedIcon />
            </IconTouchable>
          </Row>
        }
      />
      <Container>
        <Header>
          <Button
            backgroundColor="sky"
            borderColor="sky"
            color="white"
            fontWeight={700}
            onClick={() => nav("/test/choice")}
          >
            신규 분석
          </Button>
          <Button
            backgroundColor="white"
            borderColor="gray"
            color="black"
            fontWeight={700}
            onClick={() => nav("/testhistory")}
          >
            분석 이력
          </Button>
        </Header>

        <Contents>
          <TestResult
            resultLoading={resultLoading}
            result={result}
            TEST_SQ={targetTestSq}
            couponUseLoading={couponUseLoading}
            setBgmPath={setBgmPath}
          />
        </Contents>

        <Bottom id="bottom-buttons">
          <BottomBox>
            {!result?.PLAY && (
              <Button
                backgroundColor="subMain"
                borderColor="main"
                color="black"
                onClick={useCoupon}
                full
                fontWeight={700}
              >
                쿠폰 사용
              </Button>
            )}
            <Button
              backgroundColor="subMain"
              borderColor="main"
              color="black"
              onClick={() => nav("/mycoupon")}
              full
              fontWeight={700}
            >
              나의 쿠폰 (현재 {currentCouponCount}장) / 양도
            </Button>
            <Button
              backgroundColor="subMain"
              borderColor="main"
              color="black"
              onClick={() => nav("/buycoupon")}
              full
              fontWeight={700}
            >
              쿠폰 구매
            </Button>
          </BottomBox>
          <BottomBox>
            <Buttons>
              <Button
                backgroundColor="subMain"
                borderColor="main"
                color="black"
                full
                fontWeight={700}
                style={{ gap: 5 }}
                onClick={kakaoShare}
              >
                <ShareRoundedIcon style={{ fontSize: 20 }} />
                공유하기
              </Button>
              <Button
                full
                color="black"
                fontWeight={700}
                borderColor="main"
                backgroundColor="subMain"
                style={{ gap: 5 }}
                onClick={() => setIsReviewModal(true)}
              >
                <DriveFileRenameOutlineRoundedIcon style={{ fontSize: 24 }} />
                리뷰{reviewValue ? "수정" : "작성"}
              </Button>
            </Buttons>
          </BottomBox>
          <BottomBox>
            <Button
              full
              backgroundColor="pink"
              fontWeight={700}
              style={{
                animation: "flash-animation 1.2s infinite ease-in-out",
              }}
              onClick={() => {
                nav("/ai", { state: result });
              }}
            >
              플레이맵 AI 솔루션 <ChatRoundedIcon style={{ fontSize: 22 }} />
            </Button>
            <Button
              full
              backgroundColor="orange"
              fontWeight={700}
              onClick={() => {
                nav("/music", { state: result });
              }}
            >
              AI 음원듣기 <AudiotrackRoundedIcon style={{ fontSize: 22 }} />
            </Button>
          </BottomBox>
          <BottomBox>
            <Button
              full
              fontWeight={700}
              onClick={openOfflineReserveURL}
              style={{ gap: 5 }}
            >
              밸런스플레이 알아보기{" "}
              <OpenInNewRoundedIcon style={{ fontSize: 24 }} />
            </Button>
          </BottomBox>
        </Bottom>

        <LogoutBtn onClick={() => nav("/profile")}>로그아웃</LogoutBtn>

        {isReviewModal && (
          <ReviewModal
            {...{
              result,
              targetTestSq,
              reviewValue,
              setReviewValue,
              onClose: () => setIsReviewModal(false),
            }}
          />
        )}
      </Container>

      <Guide />
    </>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  button {
    flex: 1;
  }
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const IconTouchable = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  & > svg {
    font-size: 40px;
    color: ${colors.main};
  }
`;
const Contents = styled.div`
  flex: 1;
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const BottomBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${colors.black}bb;
    transform: translateY(-1px);
    margin: 0 2px;
  }
`;
const LogoutBtn = styled.div`
  margin: 30px auto;
  font-size: 12px;
  color: ${colors.gray};
  text-decoration: underline;
  cursor: pointer;
`;
