import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { NoneItem } from "..";
import colors from "../../../assets/colors";

interface Props {
  testList: Test.History[] | undefined;
  profileList: Common.Profile[] | undefined;
  isLoading: boolean;
}
export default ({ isLoading, testList = [], profileList = [] }: Props) => {
  const findProfileName = (PRF_SQ: number) => {
    const profile = profileList?.find((x) => x?.PRF_SQ === PRF_SQ);
    return profile ? profile?.PRF_NM : "-"; // 기본값 처리
  };

  const onclick = (TEST_SQ: number) => {
    const currentUrl = `${window.location.protocol}//${window.location.host}/sharepage?testsq=${TEST_SQ}`;
    window.open(currentUrl);
  };

  return (
    <Container>
      <Header>
        {isLoading ? "로딩중.." : <>총 {testList?.length}회 분석</>}
      </Header>
      <Contents>
        {isLoading ? (
          <>
            <Skeleton height={51} borderRadius={10} />
            <Skeleton height={51} borderRadius={10} />
          </>
        ) : !testList?.length ? (
          <NoneItem>항목이 없어요.</NoneItem>
        ) : (
          testList?.map((item) => (
            <Box onClick={() => onclick(item?.TEST_SQ)} key={item?.TEST_SQ}>
              <Left>{findProfileName(item?.PRF_SQ)}</Left>
              <Right>{item?.CRT_DT}</Right>
            </Box>
          ))
        )}
      </Contents>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${colors.whiteGray}20;
  }
`;
const Left = styled.div`
  font-weight: 500;
`;
const Right = styled.div`
  font-size: 14px;
  color: #999;
`;
