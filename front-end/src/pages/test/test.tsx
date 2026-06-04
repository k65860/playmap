import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { alert, http, range } from "../../assets/functions";
import colors from "../../assets/colors";
import Progress from "../../components/progress";
import { useMemo, useState } from "react";
import Button from "../../layouts/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { useRecoilValue } from "recoil";
import { testHistoryListAtom } from "../../assets/atoms";

export default () => {
  const nav = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState<number>(0);
  const [result, setResult] = useState<Test.Result>();
  const testHistory = useRecoilValue(testHistoryListAtom);

  const prfSq = useMemo(() => {
    return Number(sessionStorage.getItem("PRF_SQ") ?? 0);
  }, [sessionStorage.getItem("PRF_SQ")]);

  const testSq = useMemo(() => {
    return location?.search?.split("=")[1];
  }, [location]);

  const { data: test, isLoading } = useQuery<Test.Test>(
    [`/test/standard/${testSq}`, testSq],
    async () => {
      if (!testSq) return;
      const { data } = await http.get(`/test/standard/${testSq}`);
      if (!data?.result) return alert.error(data?.message);
      return data?.body;
    },
    {
      enabled: !!testSq,
      refetchOnWindowFocus: false,
    }
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const itemClick = (
    TEST_QSTN_SQ: number,
    TEST_QSTN_ITM_SQ: number,
    TEST_QSTN_ITM_PNT: number,
    TEST_CTGR_SQ: number
  ) => {
    setResult((prev) => {
      // 이전 상태 초기화
      const updatedResult = prev || {
        TEST_TP_SQ: test?.TEST_TP_SQ || 0,
        PRF_SQ: prfSq,
        ITEM_LIST: [],
      };

      // ITEM_LIST에서 기존 항목 찾기
      const existingItemIndex = updatedResult.ITEM_LIST.findIndex(
        (item) => item?.TEST_QSTN_SQ === TEST_QSTN_SQ
      );

      // 기존 항목을 수정하거나 새 항목 추가
      const updatedItemList =
        existingItemIndex !== -1
          ? updatedResult?.ITEM_LIST.map((item, index) =>
              index === existingItemIndex
                ? {
                    TEST_QSTN_SQ,
                    TEST_QSTN_ITM_PNT,
                    TEST_CTGR_SQ,
                    TEST_QSTN_ITM_SQ,
                  }
                : item
            )
          : [
              ...updatedResult?.ITEM_LIST,
              {
                TEST_QSTN_SQ,
                TEST_QSTN_ITM_PNT,
                TEST_CTGR_SQ,
                TEST_QSTN_ITM_SQ,
              },
            ];

      return {
        ...updatedResult,
        ITEM_LIST: updatedItemList,
      };
    });
  };

  const totalCount = useMemo(() => {
    return (
      test?.CATEGORY?.reduce((acc, category) => {
        return acc + (category?.QUESTION?.length || 0);
      }, 0) || 0
    );
  }, [test]);

  const currentCount = useMemo(() => {
    return result?.ITEM_LIST?.length ?? 0;
  }, [result]);

  // ! 다음
  const next = () => {
    const testLength = test?.CATEGORY[activePage]?.QUESTION?.length;
    const resultLength = result?.ITEM_LIST?.filter(
      (x) => x?.TEST_CTGR_SQ === activePage + 1
    )?.length;

    if (testLength !== resultLength)
      return alert.error("선택되지 않은 항목이 있습니다.");

    setActivePage((prev) => prev + 1);
    scrollToTop();
  };

  // ! 제출
  const { mutate: submit } = useMutation(async () => {
    const ask = window.confirm("제출하시겠습니까?");
    if (!ask) return;
    const body = {
      TEST_TP_SQ: result?.TEST_TP_SQ ?? 0,
      PRF_SQ: result?.PRF_SQ ?? 0,
      ITEM_LIST: result?.ITEM_LIST?.map((item) => {
        return {
          TEST_QSTN_SQ: item?.TEST_QSTN_SQ,
          TEST_QSTN_ITM_SQ: item?.TEST_QSTN_ITM_SQ,
        };
      }),
    };

    const { data } = await http.post("/test", body);
    if (!data?.result) return alert.error(data?.message);
    nav("/", { state: { TEST_SQ: data?.body?.TEST_SQ } });
  });

  const endTest = () => {
    const ask = window.confirm("분석을 종료하시겠습니까?");
    if (!ask) return;

    nav(testHistory?.length ? "/" : "/profile");
  };

  return (
    <Container>
      <Header>
        <Title>
          <MainTitle>{test?.TEST_TP_NM}</MainTitle>
          <Button onClick={endTest}>분석 종료하기</Button>
        </Title>
        <Desc>{test?.TEST_TP_CN}</Desc>
        <Desc>다음 설문 문항에 해당되는 답변을 체크 하시면 됩니다.</Desc>
      </Header>
      <Progress total={totalCount} current={currentCount} />
      <Contents>
        {isLoading ? (
          <BoxContainer>
            {range(3)?.map((i) => (
              <div key={i}>
                <Skeleton width={170} height={40} />
                <Skeleton width={300} height={60} />
                <Skeleton width={300} height={60} />
              </div>
            ))}
          </BoxContainer>
        ) : (
          <BoxContainer>
            {test?.CATEGORY?.length === activePage && (
              <Box>
                모든 항목이 선택되었습니다.
                <br />
                제출을 진행해주세요.
              </Box>
            )}
            <Box>
              <Title>{test?.CATEGORY[activePage]?.TEST_CTGR_NM}</Title>
              <SubTitle>{test?.CATEGORY[activePage]?.TEST_CTGR_CN}</SubTitle>
            </Box>
            {test?.CATEGORY[activePage]?.QUESTION?.map((item, i) => (
              <Box key={item?.TEST_QSTN_SQ}>
                <AskTitle>
                  {i + 1}. {item?.TEST_QSTN_NM}
                </AskTitle>
                <ItemBox>
                  {item?.QUESTION_ITEM?.map((x: Test.QuestionItem, i) => (
                    <Item key={x?.TEST_QSTN_ITM_SQ}>
                      <input
                        hidden
                        type="radio"
                        name={item?.TEST_QSTN_SQ?.toString()}
                        id={
                          "checkbox" +
                          item?.TEST_QSTN_SQ +
                          "-" +
                          x?.TEST_QSTN_ITM_SQ
                        }
                      />
                      <label
                        style={{
                          letterSpacing:
                            x?.TEST_QSTN_ITM_NM?.length > 4
                              ? -0.7
                              : x?.TEST_QSTN_ITM_NM?.length > 3
                              ? -0.5
                              : 0,
                        }}
                        className={
                          result?.ITEM_LIST?.some(
                            (y) =>
                              y?.TEST_QSTN_SQ === item?.TEST_QSTN_SQ &&
                              y?.TEST_QSTN_ITM_SQ === x?.TEST_QSTN_ITM_SQ
                          )
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          itemClick(
                            item?.TEST_QSTN_SQ,
                            x?.TEST_QSTN_ITM_SQ,
                            x?.TEST_QSTN_ITM_PNT,
                            item?.TEST_CTGR_SQ
                          )
                        }
                        htmlFor={
                          "checkbox" +
                          item?.TEST_QSTN_SQ +
                          "-" +
                          x?.TEST_QSTN_ITM_SQ
                        }
                      >
                        {x?.TEST_QSTN_ITM_NM}
                      </label>
                    </Item>
                  ))}
                </ItemBox>
              </Box>
            ))}
          </BoxContainer>
        )}
      </Contents>
      <Bottom>
        {activePage !== 0 && (
          <Button
            onClick={() => {
              setActivePage((prev) => prev - 1);
              scrollToTop();
            }}
            full
            backgroundColor="gray"
          >
            이전
          </Button>
        )}
        {test?.CATEGORY?.length === activePage ? (
          <Button full onClick={submit}>
            제출하기
          </Button>
        ) : (
          <Button onClick={next} full>
            다음
          </Button>
        )}
      </Bottom>
    </Container>
  );
};
const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;
const Title = styled.h3`
  display: flex;
  align-items: center;
  color: ${colors?.main};
  justify-content: space-between;
  font-size: 16px;
  font-weight: 900;
`;
const MainTitle = styled.div`
  font-size: 22px;
  font-weight: 900;
`;
const SubTitle = styled.div`
  font-size: 14px;
  color: ${colors?.gray};
`;
const ItemBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #eee;
  border-radius: 25px;
  & p {
    flex: 1;
  }
`;
const Desc = styled.p`
  font-size: 12px;
  color: #999;
`;
const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AskTitle = styled.p`
  font-size: 14px;
`;
const Item = styled.p`
  font-size: 14px;
  text-align: center;
  width: 100%;
  height: 100%;

  label {
    height: 34px;
    font-size: 12px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.active {
      border-radius: 25px;
      background-color: ${colors?.main};
      color: ${colors?.white};
    }
  }
`;
