import styled from "styled-components";
import colors from "../../assets/colors";
import { alert, http } from "../../assets/functions";
import { useEffect, useMemo, useState } from "react";
import Tab from "../../layouts/tab";
import Button from "../../layouts/button";
import Modal from "../../layouts/modal";
import Input from "../../layouts/input";
import { useMutation } from "react-query";
import ResultMiddleImage from "../../components/result-middle-image";
import 우리아이신체활동솔루션_이미지 from "../../assets/images/result/우리아이신체활동솔루션.webp";
import 우리아이수업지도안_이미지 from "../../assets/images/result/우리아이수업지도안.webp";
import 우리아이운동학습방법_이미지 from "../../assets/images/result/우리아이운동학습방법.webp";
import 우리아이학습방법_이미지 from "../../assets/images/result/우리아이학습방법.webp";

interface Props {
  data: Test.HistoryDetail;
  TEST_SQ: number;
}

export default ({ data, TEST_SQ }: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviewValue, setReviewValue] = useState<string>("");
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false);

  const currentData = useMemo(() => {
    return data?.PLAY?.find((item) => item?.PLAY_SQ === activeTab);
  }, [activeTab]);

  const { mutate: postReview } = useMutation(async () => {
    const body = {
      TEST_RVW: reviewValue,
    };
    const { data } = await http.post(`/test/${TEST_SQ}/review`, body);
    if (!data?.result) return alert.error(data?.message);
    setIsReviewModal(false);
    alert.success("완료되었어요.");
  });

  useEffect(() => {
    if (!data?.PLAY[0]?.PLAY_SQ) return;
    setActiveTab(data?.PLAY[0]?.PLAY_SQ);
  }, [data?.PLAY[0]?.PLAY_SQ]);

  useEffect(() => {
    setReviewValue(data?.TEST_RVW ?? "");
  }, [data?.TEST_RVW]);

  return (
    <ContainerBox>
      <Container>
        <Title style={{ color: colors?.white }}>
          우리 아이 기질 분석 및 놀이 유형은?
        </Title>

        <Div>
          <Tab
            activebackgroundcolor="depPink"
            onClick={(e) => setActiveTab(e)}
            value={activeTab}
            array={data?.PLAY?.map((x) => {
              return {
                name: x?.PLAY_NM,
                id: x?.PLAY_SQ,
              };
            })}
          />
        </Div>

        <ImgContainer>
          <Img src={currentData?.PLAY_IMG_PATH} />
        </ImgContainer>

        <Title>우리 아이 기질 분석의 놀이 유형은?</Title>
        <Desc>{currentData?.PLAY_DESC}</Desc>
        <BoxContainer>
          <BoxTitle>주요 기준</BoxTitle>
          <Box>
            아이의 기질 항목 중 가장 높은 요인의 점수를 바탕으로 놀이유형이 선정
            되었습니다
          </Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>기질 설명</BoxTitle>
          <Box>{currentData?.PLAY_EPNTN}</Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>부모님께 드리는 말씀</BoxTitle>
          <Box>{currentData?.PLAY_PARENTS_MSG}</Box>
        </BoxContainer>
      </Container>

      <Container>
        <Title>우리 아이 놀이 유형은?</Title>
        <BoxContainer>
          <BoxTitle>특징</BoxTitle>
          <Box>{currentData?.PLAY_FEAT}</Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>장점</BoxTitle>
          <Box>{currentData?.PLAY_STRONG}</Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>단점</BoxTitle>
          <Box>{currentData?.PLAY_WEAK}</Box>
        </BoxContainer>
      </Container>

      <Container>
        <Title>
          <ResultMiddleImage
            type="circle"
            src={우리아이신체활동솔루션_이미지}
          />
          우리 아이 신체활동 솔루션
        </Title>
        <BoxContainer>
          <BoxTitle>집에서 할 수 있는 활동</BoxTitle>
          <ResultMiddleImage
            type="rect"
            src={currentData?.PLAY_HOME_IMG_PATH}
          />
          <Box>{currentData?.PLAY_HOME}</Box>
        </BoxContainer>
        <BoxContainer>
          <BoxTitle>부모님과 함께할 수 있는 활동</BoxTitle>
          <ResultMiddleImage
            type="rect"
            src={currentData?.PLAY_PARENTS_IMG_PATH}
          />
          <Box>{currentData?.PLAY_PARENTS}</Box>
        </BoxContainer>
      </Container>

      <Container>
        <Title>
          <ResultMiddleImage type="circle" src={우리아이수업지도안_이미지} />
          우리 아이 수업 지도안
        </Title>
        <ResultMiddleImage
          type="rect"
          src={currentData?.PLAY_GUIDE_IMG_PATH}
          none-margin-top
        />
        <BoxContainer>
          <BoxTitle>방법</BoxTitle>
          <Box>{currentData?.PLAY_GUIDE}</Box>
        </BoxContainer>
      </Container>

      <Container>
        <Title>
          <ResultMiddleImage type="circle" src={우리아이운동학습방법_이미지} />
          우리 아이 운동학습 방법
        </Title>
        <ResultMiddleImage
          type="rect"
          src={currentData?.PLAY_SPORTS_IMG_PATH}
          none-margin-top
        />
        <BoxContainer>
          <BoxTitle>방법</BoxTitle>
          <Box>{currentData?.PLAY_SPORTS}</Box>
        </BoxContainer>
      </Container>

      <Container>
        <Title>
          <ResultMiddleImage type="circle" src={우리아이학습방법_이미지} />
          우리 아이 학습 방법
        </Title>
        <ResultMiddleImage
          type="rect"
          src={currentData?.PLAY_LEARN_IMG_PATH}
          none-margin-top
        />
        <BoxContainer>
          <BoxTitle>방법</BoxTitle>
          <Box>{currentData?.PLAY_LEARN}</Box>
        </BoxContainer>
      </Container>

      {isReviewModal && (
        <Modal
          onClose={() => setIsReviewModal(false)}
          title={"리뷰 " + (!data?.TEST_RVW ? "작성" : "수정")}
          buttons={
            <>
              <Button full onClick={postReview}>
                작성완료
              </Button>
              <Button
                backgroundColor="gray"
                onClick={() => setIsReviewModal(false)}
                full
              >
                닫기
              </Button>
            </>
          }
        >
          <InputBox>
            <Input
              full
              type="textarea"
              value={reviewValue}
              onChange={(e) => setReviewValue(e)}
            />
          </InputBox>
        </Modal>
      )}
    </ContainerBox>
  );
};
const ContainerBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-radius: 25px;
  background-color: ${colors?.pink};
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;
const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: ${colors.depPink};
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
  width: 100%;
  font-weight: 700;
  font-size: 25px;
  color: #fff;
  word-break: auto-phrase;
  margin: 10px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-direction: column;
  white-space: break-spaces;
`;
const Desc = styled.div`
  font-size: 13px;
  color: #fff;
`;
const BoxContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5px 0 0;
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
  text-align: center;
`;
const Box = styled.div`
  white-space: break-spaces;
  word-break: auto-phrase;
  line-height: 25px;
  padding: 15px;
  width: 100%;

  span.gpt {
    font-weight: 900;
    color: ${colors.depPink};
    text-shadow: 0 0 ${colors.depPink};
  }
`;
const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
