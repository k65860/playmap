import styled from "styled-components";
import Button from "../../layouts/button";
import Modal from "../../layouts/modal";
import { alert, http } from "../../assets/functions";
import { useMutation, useQuery } from "react-query";
import { useMemo, useState } from "react";
import colors from "../../assets/colors";
import Skeleton from "react-loading-skeleton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Props {
  result: Test.HistoryDetail;
  onClose: () => void;
}

export default ({ result, onClose }: Props) => {
  const [value, setValue] = useState<string[]>([]);

  const isDisable = useMemo<boolean>(() => {
    return !value?.join(" ")?.replace(/ /g, "");
  }, [value]);

  const { isLoading, data: keywords = [] } = useQuery<string[][]>(
    ["/gpt/keyword"],
    async () => {
      const { data } = await http.get("/gpt/keyword");
      return data?.body ?? [];
    }
  );

  const { isLoading: askLoading, mutate } = useMutation(async () => {
    if (isDisable) return alert.warn("질문을 완성해주세요.");

    const PRF_SQ: number = result?.PRF_SQ;
    let GPT_REF_CN: string = "나는 ";
    GPT_REF_CN += result?.TEST_TP_NM + "을 진행하였는데 ";

    GPT_REF_CN +=
      result?.CATEGORY?.map((item) => {
        return (
          item?.TEST_CTGR_NM +
          "이(가) " +
          result?.TEST_TP_MAX_PNT +
          " 만점에 " +
          item?.TEST_CTGR_PNT +
          "점"
        );
      })?.join(", ") + "을(를) 받았어.";

    GPT_REF_CN += "근데 더 궁금한 점이 있어. ";
    const GPT_CN = value?.join(" ") + "을(를) 알려줘.";

    const body = { PRF_SQ, GPT_CN, GPT_REF_CN };
    const { data } = await http.post("/gpt", body);
    if (!data?.result) return alert.error(data?.message);
    onClose();
  });

  const replaceKeyword = (keyword: string) => {
    const newKeyword = value?.filter((item) => item !== keyword);
    setValue(newKeyword);
  };

  return (
    <Modal
      onClose={onClose}
      title="질문하기"
      buttons={
        <>
          <Button
            disabled={isDisable || value?.length < 3}
            loading={askLoading}
            full
            onClick={mutate}
          >
            질문
          </Button>
          <Button backgroundColor="gray" onClick={() => onClose()} full>
            닫기
          </Button>
        </>
      }
    >
      <Container>
        <Description>
          키워드 3개 이상을 선택하여 질문을 완성해주세요.
        </Description>
        <InputPreview>
          {isDisable ? (
            <span className="none">
              <b>질문 키워드</b>를 선택해주세요.
            </span>
          ) : (
            value?.map((item) => (
              <Keyword key={item} onClick={() => replaceKeyword(item)}>
                {item}
                <CloseBtn>
                  <CloseRoundedIcon />
                </CloseBtn>
              </Keyword>
            ))
          )}
        </InputPreview>

        {isLoading ? (
          <>
            <AskKeywordList>
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={93} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={93} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
            </AskKeywordList>
            <AskKeywordList>
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
            </AskKeywordList>
            <AskKeywordList>
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={93} height={35} borderRadius={100} />
              <Skeleton width={160} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={160} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
              <Skeleton width={120} height={35} borderRadius={100} />
              <Skeleton width={60} height={35} borderRadius={100} />
              <Skeleton width={130} height={35} borderRadius={100} />
              <Skeleton width={67} height={35} borderRadius={100} />
            </AskKeywordList>
          </>
        ) : (
          keywords?.map((item1, idx) => (
            <AskKeywordList key={idx}>
              {item1?.map((item2) => (
                <AskKeywordItem
                  key={item2}
                  onClick={() => setValue((prev) => [...prev, item2])}
                >
                  <Button disabled={value?.includes(item2)}>{item2}</Button>
                </AskKeywordItem>
              ))}
            </AskKeywordList>
          ))
        )}
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;
const Description = styled.p`
  font-size: 12px;
  color: ${colors.gray};
  width: 100%;
`;
const InputPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #f5f5f5;
  border: 1px solid ${colors.whiteGray}60;
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  gap: 5px;
  position: sticky;
  top: 1px;

  .none {
    color: ${colors.gray};
    text-align: center;
    font-size: 13px;

    b {
      color: ${colors.main};
      font-weight: 900;
    }
  }
`;
const Keyword = styled.span`
  font-size: 13px;
  color: ${colors.white};
  background-color: ${colors.main};
  padding: 8px 12px;
  border-radius: 100px;
  position: relative;
  cursor: pointer;
`;
const CloseBtn = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${colors.red};

  & > svg {
    color: ${colors.white};
    font-size: 12px;
  }
`;
const AskKeywordList = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border: 1px solid ${colors.whiteGray}60;
  border-radius: 10px;
  padding: 10px;
`;
const AskKeywordItem = styled.li``;
