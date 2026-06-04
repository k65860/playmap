import styled from "styled-components";
import colors from "../../assets/colors";
import Tab from "../../layouts/tab";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { http } from "../../assets/functions";
import { getCouponListAtom, userAtom } from "../../assets/atoms";
import { useRecoilValue } from "recoil";
import Title from "../../components/title";
import Button from "../../layouts/button";
import CouponGiveModal from "../../components/coupon-give-modal";

const tabList = [
  {
    name: "구매 이력",
    id: 1,
  },
  {
    name: "사용 이력",
    id: 2,
  },
];

export default () => {
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const user = useRecoilValue(userAtom);
  const getCouponList = useRecoilValue(getCouponListAtom);
  const [isCouponGiveModal, setCouponGiveModal] = useState<boolean>(false);

  const { data: billList } = useQuery<Bill[]>(
    [`/bill?USR_SQ=${user?.USR_SQ}`, user?.USR_SQ],
    async () => {
      if (!user?.USR_SQ) return;
      const url = `/bill?USR_SQ=${user?.USR_SQ}`;
      const { data } = await http.get(url);
      return data?.body ?? [];
    },
    { enabled: !!user?.USR_SQ }
  );

  const tabClick = (val: 1 | 2) => setActiveTab(val);

  // ! 결제완료된 청구서
  const billfilterList: Bill[] = useMemo(() => {
    return billList?.filter((x) => !!x?.PYMT_CRT_DT) ?? [];
  }, [billList]);

  // ! 쿠폰 사용이력
  const usedCouponList: Coupon[] = useMemo(() => {
    return getCouponList?.filter((x) => !!x?.USE_CPN_DT) ?? [];
  }, [getCouponList]);

  // ! 잔여 쿠폰
  const currentCouponCount = useMemo(() => {
    return getCouponList?.filter((x) => !x?.USE_CPN_SQ)?.length ?? 0;
  }, [getCouponList]);

  const title = useMemo(() => {
    if (activeTab === 1) {
      return "총 " + billfilterList?.length + "회 구매";
    } else {
      return "총 " + usedCouponList?.length + "장 사용";
    }
  }, [activeTab, billfilterList, usedCouponList]);

  return (
    <>
      <Title title="보유쿠폰" />
      <Container>
        <Header>
          <Count>
            <span>{currentCouponCount}</span>개
          </Count>
          {!!currentCouponCount && (
            <Button
              backgroundColor="orange"
              onClick={() => setCouponGiveModal(true)}
            >
              쿠폰 양도
            </Button>
          )}
        </Header>
        <Contents>
          <Tab array={tabList} value={activeTab} onClick={tabClick} />
          <Desc>{title}</Desc>
          {activeTab === 1 ? (
            <BoxContainer>
              {billfilterList?.map((item) => (
                <Box key={item?.BILL_SQ}>
                  <Left>
                    <Text>{item?.BILL_NM}</Text>
                  </Left>
                  <Right>
                    <small>{item?.PYMT_CRT_DT}</small>
                  </Right>
                </Box>
              ))}
            </BoxContainer>
          ) : (
            <BoxContainer>
              {usedCouponList?.map((item) => (
                <Box key={item?.USR_CPN_SQ}>
                  <Left>
                    <Text>{item?.PRF_NM}</Text>
                  </Left>
                  <Right>
                    <small>{item?.USE_CPN_DT}</small>
                  </Right>
                </Box>
              ))}
            </BoxContainer>
          )}
        </Contents>
      </Container>

      {isCouponGiveModal && (
        <CouponGiveModal
          myCount={currentCouponCount}
          onClose={() => setCouponGiveModal(false)}
        />
      )}
    </>
  );
};
const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Contents = styled.div`
  padding: 20px;
  border-top: 1px solid #ddd;
  flex: 1;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Count = styled.p`
  span {
    color: ${colors?.main};
    font-size: 22px;
    font-weight: 700;
  }
`;
const Desc = styled.div`
  text-align: end;
  font-weight: 500;
  font-size: 12px;
`;
const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
`;
const Text = styled.p`
  font-size: 14px;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-end;
  small {
    font-size: 12px;
    color: #999;
  }
`;
