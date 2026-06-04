import { useQuery } from "react-query";
import styled from "styled-components";
import { alert, http } from "../../assets/functions";
import Button from "../../layouts/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Title from "../../components/title";
import Skeleton from "react-loading-skeleton";

export default () => {
  const nav = useNavigate();

  const prfSq = useMemo(() => {
    return Number(sessionStorage.getItem("PRF_SQ") ?? 0);
  }, [sessionStorage.getItem("PRF_SQ")]);

  const { isLoading, data: testList = [] } = useQuery(
    ["/test/standard"],
    async () => {
      const { data } = await http.get("/test/standard");
      if (!data?.result) return alert.error(data?.message);
      const result = data?.body ?? [];
      if (result?.length === 1) {
        return onClick(result[0]?.TEST_TP_SQ);
      }
      return result;
    }
  );

  const onClick = (TEST_TP_SQ: number) => {
    nav(`/test/start?test=${TEST_TP_SQ}`);
  };

  useEffect(() => {
    if (!prfSq) nav("/profile");
  }, [prfSq]);

  return (
    <>
      <Title title="분석 종류 선택" />
      <Container>
        {isLoading ? (
          <>
            <Skeleton height={36} borderRadius={36} />
            <Skeleton height={36} borderRadius={36} />
          </>
        ) : (
          testList?.map((item: any) => (
            <Button
              key={item?.TEST_TP_SQ}
              onClick={() => onClick(item?.TEST_TP_SQ)}
            >
              {item?.TEST_TP_NM}
            </Button>
          ))
        )}
      </Container>
    </>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
