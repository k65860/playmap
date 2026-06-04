import { alert, http } from "../../assets/functions";
import { useEffect, useMemo, useState } from "react";
import playmapIcon from "../../assets/images/icon/playmap.png";
import Button from "../../layouts/button";
import Input from "../../layouts/input";
import { useMutation, useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import KakaoLoginButton from "react-kakao-login";
import { userAtom } from "../../assets/atoms";
import FindId from "./find-id";
import FindPw from "./find-pw";
import {
  Bottom,
  Box,
  Container,
  Contents,
  Header,
  Icon,
  Inputs,
  KakaoLoginButtonImage,
  Review,
  reviewHeight,
  ReviewItem,
  ReviewList,
  ReviewMoreBtn,
  ReviewTitle,
  Text,
  Top,
} from "./styles";
import config from "../../assets/config";
import ReviewModal from "../../components/review-modal";

interface Account {
  id: string;
  pw: string;
}

export default () => {
  const [, setCookie] = useCookies(["PLAYMAP_TOKEN"]);
  const [, setUser] = useRecoilState<Common.User>(userAtom);
  const nav = useNavigate();
  const [isAllReview, setAllReview] = useState<boolean>(false);
  const [isFindId, setIsFindId] = useState<boolean>(false);
  const [isTempPw, setIsTempPw] = useState<boolean>(false);
  const [account, setAccount] = useState<Account>({ id: "", pw: "" });
  const [reviewIdx, setReviewIdx] = useState<number>(0);

  // ! 아이디 비밀번호 onchange
  const onAccountChange = (key: string, value: string) => {
    setAccount((prev) => ({ ...prev, [key]: value }));
  };

  // ! 로그인 함수
  const { isLoading: loginLoaing, mutate: login } = useMutation<
    void,
    void,
    Account
  >(async (account: Account) => {
    if (!account?.id) return alert.warn("아이디 입력해주세요.");
    if (!account?.pw) return alert.warn("비밀번호 입력해주세요.");

    const body = {
      USR_ID: account?.id,
      USR_PW: account?.pw,
    };

    const { data } = await http.post("/auth/signin", body);
    if (!data?.result) return alert.error(data?.message);

    if (data?.body?.REASON === "JOIN") {
      nav("/signup", {
        state: { kakaoInfo: { USR_ID: account?.id, USR_PW: account?.pw } },
      });

      return;
    }

    setCookie("PLAYMAP_TOKEN", data?.body?.PLAYMAP_TOKEN);
    if (data?.body?.USR_TP === 2) {
      nav("/profile");
    } else {
      nav("/admin");
    }
    setUser(data?.body);
  });

  const kakaoLoginSuccess = async ({ profile: { id } }: any) => {
    const data: Account = { id: id?.toString(), pw: "SNS_KAKAO" };
    login(data);
  };

  const { data: reviews = [] } = useQuery<Common.Review[]>(
    ["/common/review"],
    async () => {
      const { data } = await http.get("/common/review");
      return data?.body ?? [];
    }
  );

  const lastReviews = useMemo(() => reviews?.slice(0, 5), [reviews]);

  const reviewIntervalFunction = () => {
    setReviewIdx((prev) => {
      const result = prev + 1;
      if (result >= 3) return 0;
      return result;
    });
  };

  useEffect(() => {
    const interval = setInterval(reviewIntervalFunction, 5_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Contents
        onSubmit={(e) => {
          e?.preventDefault();
          login(account);
        }}
      >
        <Top>
          <Header>
            <Icon src={playmapIcon} />
          </Header>
          <Inputs>
            <Input
              full
              required
              value={account?.id}
              onChange={(e) => onAccountChange("id", e)}
              placeholder="아이디를 입력해주세요."
            />
            <Input
              full
              required
              value={account?.pw}
              type="password"
              onChange={(e) => onAccountChange("pw", e)}
              placeholder="비밀번호를 입력해주세요."
            />
            <Button loading={loginLoaing}>로그인</Button>
            <Box>
              <Text onClick={() => setIsFindId(true)}>아이디 찾기</Text>
              <Text className="non-cur">|</Text>
              <Text onClick={() => setIsTempPw(true)}>임시 비밀번호 발급</Text>
            </Box>
          </Inputs>
        </Top>

        {!!lastReviews?.length && (
          <>
            <ReviewTitle onClick={() => setAllReview(true)}>
              최근 리뷰
            </ReviewTitle>
            <Review onClick={() => setAllReview(true)}>
              <ReviewList style={{ top: -1 * reviewHeight * reviewIdx + "px" }}>
                {lastReviews?.map((item: Common.Review) => (
                  <ReviewItem key={item?.TEST_SQ}>
                    <img src={item?.CHAR_IMG_PATH} />
                    <span>{item?.TEST_RVW}</span>
                  </ReviewItem>
                ))}
              </ReviewList>
            </Review>
            <ReviewMoreBtn onClick={() => setAllReview(true)}>
              클릭 더보기
            </ReviewMoreBtn>
          </>
        )}

        <Bottom>
          <Button
            borderColor="gray"
            backgroundColor="white"
            color="black"
            borderRadius={4}
            type="button"
            onClick={() => nav("/signup")}
            style={{
              aspectRatio: "600 / 90",
              width: "100%",
              maxWidth: 268,
              maxHeight: 40,
            }}
          >
            회원가입
          </Button>

          <KakaoLoginButton
            token={config.KEY.KAKAO_LOGIN}
            onSuccess={kakaoLoginSuccess}
            onFail={() => {}}
            render={({ onClick }) => (
              <KakaoLoginButtonImage onClick={onClick} />
            )}
          />
        </Bottom>
      </Contents>

      {isFindId && <FindId onClose={() => setIsFindId(false)} />}
      {isTempPw && <FindPw onClose={() => setIsTempPw(false)} />}
      {isAllReview && (
        <ReviewModal reviews={reviews} onClose={() => setAllReview(false)} />
      )}
    </Container>
  );
};
