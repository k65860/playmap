import styled from "styled-components";
import FreeContents from "./freeContents";
import ChargedContents from "./chargedContents";
import { alert, http } from "../../assets/functions";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useMemo } from "react";

export default () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const TEST_SQ = useMemo(() => {
    const result = params.get("testsq");
    return result ? Number(result) : 0;
  }, [params]);

  const { data: result, isLoading: resultLoading } = useQuery(
    [`getTestResult`],
    async () => {
      if (!TEST_SQ) return;
      const { data } = await http.get(`/test/${TEST_SQ}?IS_ADM=1`);
      if (!data?.result) return alert.error(data?.message);
      return data?.body ?? [];
    },
    {
      enabled: !!TEST_SQ,
    }
  );

  return (
    <Container isplay={!!result?.PLAY}>
      <FreeContents
        data={result}
        resultLoading={resultLoading}
        sharepage={true}
      />
      {result?.PLAY && (
        <>
          <ChargedContents data={result} TEST_SQ={TEST_SQ} />
        </>
      )}
    </Container>
  );
};

const Container = styled.main<{ isplay: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 30px;
  border-radius: 25px;
  background: ${({ isplay }) =>
    isplay
      ? "inherit" // 부모 색상을 그대로 유지
      : `linear-gradient(
          to bottom,
          inherit 0%,
          transparent 100%
        )`};
`;
