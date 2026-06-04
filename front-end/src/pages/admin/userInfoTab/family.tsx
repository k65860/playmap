import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { NoneItem } from "..";

interface Props {
  profileList: Common.Profile[] | undefined;
  testList: Test.History[] | undefined;
  isLoading: boolean;
}
export default ({ profileList, testList, isLoading }: Props) => {
  const currentTestCount = (PRF_SQ: number) => {
    const data = testList?.filter((x) => x?.PRF_SQ === PRF_SQ);
    return data?.length;
  };

  return (
    <Container>
      <Header>
        {isLoading ? "로딩중.." : <>총 {profileList?.length}명</>}
      </Header>
      <Contents>
        {isLoading ? (
          <>
            <Skeleton height={73} borderRadius={10} />
            <Skeleton height={73} borderRadius={10} />
          </>
        ) : !profileList?.length ? (
          <NoneItem>항목이 없어요.</NoneItem>
        ) : (
          profileList?.map((item) => (
            <Box key={item?.PRF_SQ}>
              <Left>{item?.PRF_NM}</Left>
              <Right>
                <Text>분석 {currentTestCount(item?.PRF_SQ)}회</Text>
                <SubText>{item?.CRT_DT} 가입</SubText>
              </Right>
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
`;
const Left = styled.div`
  font-weight: 500;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;
const Text = styled.p`
  font-size: 14px;
`;
const SubText = styled.p`
  font-size: 14px;
  color: #999;
`;
