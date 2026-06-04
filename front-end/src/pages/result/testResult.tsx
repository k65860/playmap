import styled from "styled-components";
import FreeContents from "./freeContents";
import { range } from "../../assets/functions";
import { Skeleton } from "@mui/material";
import ChargedContents from "./chargedContents";
import { Dispatch, SetStateAction } from "react";

interface Props {
  result: null | Test.HistoryDetail;
  TEST_SQ: number;
  couponUseLoading: boolean;
  resultLoading: boolean;
  setBgmPath: Dispatch<SetStateAction<string>>;
}

export default ({
  result,
  TEST_SQ,
  couponUseLoading,
  resultLoading,
  setBgmPath,
}: Props) => {
  return (
    <Container isplay={result?.PLAY ? "inherit" : ""}>
      <FreeContents
        data={result}
        resultLoading={resultLoading}
        setBgmPath={setBgmPath}
      />
      {result?.PLAY && (
        <>
          {couponUseLoading ? (
            <>
              {range(3)?.map((i) => (
                <div key={i}>
                  <Skeleton width={170} height={40} />
                  <Skeleton width={300} height={60} />
                  <Skeleton width={300} height={60} />
                </div>
              ))}
            </>
          ) : (
            <ChargedContents data={result} TEST_SQ={TEST_SQ} />
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div<{ isplay: string }>`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  gap: 30px;
  border-radius: 25px;
  background: ${({ isplay }) =>
    isplay === "inherit"
      ? "inherit" // 부모 색상을 그대로 유지
      : `linear-gradient(
          to bottom,
          inherit 0%,
          transparent 100%
        )`};
`;
const Date = styled.div`
  text-align: center;
`;
