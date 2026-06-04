import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { NoneItem } from "..";

interface Props {
  billList: Bill[] | undefined;
  isLoading: boolean;
}
export default ({ isLoading, billList }: Props) => {
  const buyList: Bill[] = useMemo(() => {
    return billList?.filter((x) => !!x?.PYMT_SQ) ?? [];
  }, [billList]);

  return (
    <Container>
      <Header>
        {isLoading ? "로딩중.." : <>총 {buyList?.length}장 구매</>}
      </Header>
      <Contents>
        {isLoading ? (
          <>
            <Skeleton height={51} borderRadius={10} />
            <Skeleton height={51} borderRadius={10} />
          </>
        ) : !buyList?.length ? (
          <NoneItem>항목이 없어요.</NoneItem>
        ) : (
          buyList?.map((item) => (
            <Box key={item?.BILL_SQ}>
              <Left>쿠폰{item?.BILL_CPN_CNT}장 구매</Left>
              <Right>
                <Text>{item?.BILL_PRC?.toLocaleString()}원</Text>
                <SubText>{item?.PYMT_CRT_DT}</SubText>
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
