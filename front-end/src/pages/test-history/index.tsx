import styled from "styled-components";
import Button from "../../layouts/button";
import { useMemo } from "react";
import { http } from "../../assets/functions";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { testTypeAtom } from "../../assets/atoms";
import Title from "../../components/title";

export default () => {
  const nav = useNavigate();
  const testType = useRecoilValue(testTypeAtom);

  const prfSq = useMemo(() => {
    return Number(sessionStorage.getItem("PRF_SQ") ?? 0);
  }, [sessionStorage.getItem("PRF_SQ")]);

  const { data } = useQuery<Test.History[]>(
    [`/test?PRF_SQ=${prfSq}`, prfSq],
    async () => {
      const { data } = await http.get(`/test?PRF_SQ=${prfSq}`);
      return data?.body ?? [];
    },
    {
      enabled: !!prfSq,
    }
  );

  const testName = (TEST_TP_SQ: number) => {
    return (
      testType?.find((x) => x?.TEST_TP_SQ === TEST_TP_SQ)?.TEST_TP_NM ?? "-"
    );
  };

  const onClick = (TEST_SQ: number) => {
    nav("/", { state: { TEST_SQ } });
  };

  return (
    <>
      <Title title="분석 이력" />
      <Container>
        <Header>
          <Button
            backgroundColor="sky"
            borderColor="sky"
            color="white"
            onClick={() => nav("/test/choice")}
            full
          >
            신규 분석
          </Button>
        </Header>
        <Contents>
          {data?.map((item: Test.History) => (
            <Box key={item?.TEST_SQ} onClick={() => onClick(item?.TEST_SQ)}>
              <Text>{testName(item?.TEST_TP_SQ)}</Text>
              <Text>{item?.CRT_DT}</Text>
            </Box>
          ))}
        </Contents>
      </Container>
    </>
  );
};
const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
`;
const Text = styled.p`
  font-size: 14px;
`;
