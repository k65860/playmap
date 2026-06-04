import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { NoneItem } from "..";

interface Props {
  isLoading: boolean;
  couponList: Coupon[] | undefined;
}
export default ({ isLoading, couponList }: Props) => {
  const useCouponList = useMemo(() => {
    return couponList?.filter((x) => !!x?.USE_CPN_SQ);
  }, [couponList]);

  return (
    <Container>
      <Header>
        {isLoading ? "로딩중.." : <>총 {useCouponList?.length}장 사용</>}
      </Header>
      <Contents>
        {isLoading ? (
          <>
            <Skeleton height={51} borderRadius={10} />
            <Skeleton height={51} borderRadius={10} />
          </>
        ) : !useCouponList?.length ? (
          <NoneItem>항목이 없어요.</NoneItem>
        ) : (
          useCouponList?.map((item) => (
            <Box key={item?.USE_CPN_SQ}>
              <Left>{item?.PRF_NM}</Left>
              <Right>
                <SubText>{item?.USE_CPN_DT}</SubText>
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
