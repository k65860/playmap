import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Tab from "../../layouts/tab";
import { dateFormat, range } from "../../assets/functions";
import colors from "../../assets/colors";
import { Skeleton } from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";

interface Props {
  data: null | Test.HistoryDetail;
  resultLoading: boolean;
  sharepage?: boolean;
  setBgmPath?: Dispatch<SetStateAction<string>>;
}

export default ({ data, resultLoading, sharepage, setBgmPath }: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const currentData = useMemo(() => {
    return data?.CHARACTER?.find((item) => item?.CHAR_SQ === activeTab);
  }, [activeTab]);

  const topThreeCategories = useMemo<number[]>(() => {
    const sortedCategories = data?.CATEGORY?.sort(
      (a, b) => b?.TEST_CTGR_PNT - a?.TEST_CTGR_PNT
    );
    return (
      sortedCategories?.slice(0, 3)?.map((item) => item?.TEST_CTGR_SQ) ?? []
    );
  }, [data?.CATEGORY]);

  useEffect(() => {
    setActiveTab(data?.CHARACTER?.[0]?.CHAR_SQ ?? 0);
  }, [data?.CHARACTER[0]?.CHAR_SQ]);

  useEffect(() => {
    if (!activeTab) return;

    const find = data?.CHARACTER?.find((x) => x?.CHAR_SQ === activeTab);
    if (!find) return;

    if (setBgmPath) setBgmPath?.(find?.CHAR_BGM_PATH);
  }, [activeTab]);

  return (
    <>
      <Container>
        <Date>{dateFormat(data?.CRT_DT ?? "")} 분석 결과</Date>
        <Title>우리 아이 기질 분석의 캐릭터는?</Title>
        {resultLoading ? (
          <>
            {range(5)?.map((i) => (
              <div key={i}>
                <Skeleton width={170} height={40} />
                <Skeleton width={300} height={60} />
                <Skeleton width={300} height={60} />
              </div>
            ))}
          </>
        ) : (
          <Desc>{currentData?.CHAR_DESC}</Desc>
        )}
        <Div>
          <Tab
            activebackgroundcolor="darkYellow"
            onClick={(e) => setActiveTab(e)}
            value={activeTab}
            array={
              data?.CHARACTER?.map((x) => {
                return {
                  name: x?.CHAR_NM,
                  id: x?.CHAR_SQ,
                };
              }) ?? []
            }
          />
        </Div>

        <ImgContainer>
          <Img src={currentData?.CHAR_IMG_PATH} />
        </ImgContainer>

        <ChartContainer>
          {data?.CATEGORY?.map((item) => (
            <ChartItem key={item?.TEST_CTGR_SQ}>
              <ChartItemTitle
                total={data?.TEST_TP_MAX_PNT}
                now={item?.TEST_CTGR_PNT}
              >
                {topThreeCategories?.includes(item?.TEST_CTGR_SQ) && (
                  <LocalFireDepartmentRoundedIcon />
                )}
                {item?.TEST_CTGR_NM}
              </ChartItemTitle>
              <ChartProgress
                total={data?.TEST_TP_MAX_PNT}
                now={item?.TEST_CTGR_PNT}
              />
            </ChartItem>
          ))}
        </ChartContainer>

        <BoxContainer>
          <BoxTitle>주요 기준</BoxTitle>
          {/* <Box>{currentData?.CHAR_STDD}</Box> */}
          <Box>
            아이의 기질 항목 중 가장 높은 요인의 점수를 바탕으로 캐릭터가 선정
            되었습니다
          </Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>장점</BoxTitle>
          <Box>{currentData?.CHAR_STRONG}</Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>단점</BoxTitle>
          <Box>{currentData?.CHAR_WEAK}</Box>
        </BoxContainer>
      </Container>

      {!data?.PLAY && !sharepage && (
        <>
          <BottomTitle isplay={!!data?.PLAY}>
            <p>우리 아이 기질 분석 및 놀이 유형은?</p>
          </BottomTitle>
          <Bottom>
            <div>
              쿠폰을 사용하여 <span>더 상세한 분석</span> 솔루션 결과를 확인할
              수 있어요.
            </div>
          </Bottom>
        </>
      )}
    </>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-radius: 25px;
  background-color: ${colors.depYellow};
`;
const BottomTitle = styled.div<{ isplay: boolean }>`
  font-weight: 700;
  font-size: 25px;
  color: #292929;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
  color: #fff;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  background: ${({ isplay }) => {
    if (isplay) return colors.pink;
    const result = `linear-gradient(to bottom, ${colors.pink} 0%, ${colors.pink} 50%, transparent 100%)`;
    return result;
  }};
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  font-size: 14px;
  text-align: center;
  svg {
    color: #aaa;
    font-size: 30px;
  }
  span {
    color: ${colors?.red};
    font-weight: 500;
  }
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 10px;
`;
const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fed772;
  max-width: 75vw;
  max-height: 75vw;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-bottom: 20px;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 25px;
  color: #292929;
  word-break: auto-phrase;
  padding: 10px 0;
  text-align: center;
`;
const Desc = styled.div`
  font-size: 13px;
  color: #292929;
  text-align: center;
`;
const Date = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #5e5e5e;
  font-size: 13px;
`;
const BoxContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0 0;
  font-weight: 500;
  background-color: #fff;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  margin: 10px 0;
`;
const BoxTitle = styled.div`
  position: absolute;
  top: -16px;
  left: 50%;
  font-size: 14px;
  color: #fff;
  background-color: ${colors?.main};
  padding: 6px 20px;
  transform: translateX(-50%);
  border-radius: 25px;
  white-space: nowrap;
`;
const Box = styled.div`
  white-space: break-spaces;
  word-break: auto-phrase;
  line-height: 25px;
  padding: 15px;
  width: 100%;
`;
const ChartContainer = styled.div`
  width: 100%;
  flex: 1;
  margin-bottom: 20px;
  border-radius: 50%;
`;
const ChartItem = styled.div`
  margin-bottom: 14px;
`;
const ChartItemTitle = styled.p<{ total: number; now: number }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 5px;
  position: relative;

  &::after {
    content: "${(x) => x?.now}/${(x) => x?.total}";
    font-size: 12px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  & > svg {
    font-size: 20px;
    color: ${colors.orange};
  }
`;
const ChartProgress = styled.div<{ total: number; now: number }>`
  width: 100%;
  height: 10px;
  border-radius: 100px;
  background-color: ${colors.white}50;
  position: relative;
  padding: 1px;

  &::before {
    content: "";
    position: absolute;
    width: calc(${(x) => (x?.now / x?.total) * 100}% - 2px);
    height: calc(100% - 2px);
    border-radius: 100px;
    display: block;
    background: linear-gradient(to right, #fcd060, #d89e19);
  }
`;
