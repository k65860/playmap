import styled from "styled-components";
import Button from "../../layouts/button";
import Input from "../../layouts/input";
import { useMemo, useState } from "react";
import { useMutation } from "react-query";
import { alert, http } from "../../assets/functions";
import { useRecoilValue } from "recoil";
import { settingAtom, userAtom } from "../../assets/atoms";
import Title from "../../components/title";

export default () => {
  const [count, setCount] = useState<number>(1);
  const [joinCode, setJoinCode] = useState<string>("");
  const user = useRecoilValue(userAtom);
  const setting = useRecoilValue(settingAtom);

  const price = useMemo(() => {
    return setting?.find((x) => x?.SET_GRP === "CPN_PRC")?.SET_VAL ?? 0;
  }, [setting]);

  const pricecount = useMemo(() => {
    const pay = Number(price || 0) * count;
    return pay?.toLocaleString();
  }, [price, count]);

  const { mutate } = useMutation(async () => {
    const ask = window.confirm("구매하시겠어요?");
    if (!ask) return;
    const body = {
      USR_SQ: user?.USR_SQ,
      BILL_CPN_CNT: count,
      USR_JOIN_CD: joinCode,
    };
    const { data } = await http.post(`/bill/req`, body);
    if (!data?.result) return alert.error(data?.message);
    alert.success("요청되었어요.");
  });

  const payText = useMemo(() => {
    return setting?.find((x) => x?.SET_GRP === "PAYMENT_BILL_MSG")?.SET_VAL;
  }, [setting]);

  return (
    <>
      <Title title="쿠폰 구매" />
      <Container>
        <Contents>
          <Desc>{payText}</Desc>
          <CountBox>
            <p>수량</p>{" "}
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(val) => setCount(Number(val))}
              width={120}
            />
          </CountBox>
          <CountBox>
            <p>추천인 코드</p>{" "}
            <Input
              value={joinCode}
              onChange={(val) => setJoinCode(val)}
              width={170}
              maxLength={12}
              placeholder="추천인 코드 (선택입력)"
            />
          </CountBox>
        </Contents>
        <Bottom>
          <Text>X {count}장</Text>
          <TotalPlace>총 {pricecount}원</TotalPlace>
        </Bottom>
        <Button onClick={mutate} full>
          구매 청구서 전송
        </Button>
      </Container>
    </>
  );
};
const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 30px;
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TotalPlace = styled.h3`
  font-size: 26px;
  font-weight: 900;
`;
const Desc = styled.div`
  font-size: 14px;
  white-space: pre-line;
`;
const CountBox = styled.div`
  display: flex;
  align-items: center;

  & > p {
    width: 100px;
  }
`;
const Text = styled.div`
  font-size: 14px;
`;
