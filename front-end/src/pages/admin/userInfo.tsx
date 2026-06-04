import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Tab from "../../layouts/tab";
import Buy from "./userInfoTab/buy";
import Use from "./userInfoTab/use";
import Family from "./userInfoTab/family";
import Download from "./userInfoTab/download";
import Test from "./userInfoTab/test";
import { useMutation, useQuery } from "react-query";
import { alert, http } from "../../assets/functions";
import Title from "../../components/title";
import Skeleton from "react-loading-skeleton";
import Button from "../../layouts/button";

const tabList = [
  { id: 1, name: "분석" },
  { id: 2, name: "구매" },
  { id: 3, name: "사용" },
  { id: 4, name: "가족" },
  { id: 5, name: "다운로드" },
];

export default () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const location = useLocation()?.state;

  const USR_SQ: number = useMemo(() => {
    return location?.USR_SQ ?? 0;
  }, [location?.USR_SQ]);

  // ! 유저 정보 조회
  const { isLoading, data: userInfo } = useQuery<Common.User>(
    [`/auth/user/${USR_SQ}`],
    async () => {
      const url = `/auth/user/${USR_SQ}`;
      const { data } = await http.get(url);
      if (!data?.result) {
        alert.error(data?.message);
        return null;
      }
      return data?.body;
    },
    { enabled: !!USR_SQ }
  );

  // ! 프로필 리스트 조회
  const {
    isLoading: profileLoading,
    data: profileList,
    refetch,
  } = useQuery<Common.Profile[]>(
    [`/profile?USR_SQ=${USR_SQ}`],
    async () => {
      const url = `/profile?USR_SQ=${USR_SQ}`;
      const { data } = await http.get(url);
      if (!data?.result) return;
      return data?.body;
    },
    { enabled: !!USR_SQ }
  );

  // ! 결제 내역 조회
  const { isLoading: billLoading, data: billList = [] } = useQuery<Bill[]>(
    [`/bill?USR_SQ=${USR_SQ}`],
    async () => {
      const url = `/bill?USR_SQ=${USR_SQ}`;
      const { data } = await http.get(url);
      if (!data?.result) return alert.error(data?.message);
      return data?.body;
    },
    { enabled: !!USR_SQ }
  );

  // ! 쿠폰 조회
  const { isLoading: couponLoading, data: couponList = [] } = useQuery<
    Coupon[]
  >(
    [`/coupon?USR_SQ=${USR_SQ}`],
    async () => {
      const url = `/coupon?USR_SQ=${USR_SQ}`;
      const { data } = await http.get(url);
      if (!data?.result) return alert.error(data?.message);
      return data?.body;
    },
    { enabled: !!USR_SQ }
  );

  // ! 교환 이력 조회
  const { isLoading: exchangeLoading, data: exchangeList = [] } = useQuery<
    Exchange.History[]
  >(
    [`/exchange?USR_SQ=${USR_SQ}`],
    async () => {
      const url = `/exchange?USR_SQ=${USR_SQ}`;
      const { data } = await http.get(url);
      return data?.body ?? [];
    },
    { enabled: !!USR_SQ }
  );

  // ! 분석 내역 조회
  const { isLoading: testLoading, data: testList = [] } = useQuery<
    Test.History[]
  >(
    ["getTestList", USR_SQ, profileList],
    async () => {
      const result: Test.History[] = [];
      if (!profileList) {
        refetch();
        return result;
      }

      for (const { PRF_SQ } of profileList) {
        const url = `/test?PRF_SQ=${PRF_SQ}`;
        const { data } = await http.get(url);
        if (!data?.result) {
          alert.error(data?.message);
          return result;
        }
        result.push(...data.body);
      }

      return result;
    },
    { enabled: !!USR_SQ || !!profileList }
  );

  // ! 쿠폰보유개수
  const couponCount = useMemo(() => {
    const list = couponList?.filter((x) => !x?.USE_CPN_SQ) ?? [];
    return list?.length ?? 0;
  }, [couponList]);

  // ! 총 결제금액
  const totalPaid = useMemo(() => {
    const list = billList?.filter((x) => !!x?.PYMT_CRT_DT) ?? [];
    const result = list?.reduce((acc, cur) => acc + cur?.BILL_PRC, 0);
    return result?.toLocaleString();
  }, [billList]);

  // ! 이름
  const profileText = useMemo(() => {
    const count = profileList?.length ?? 0;
    const name = profileList?.[0]?.PRF_NM;
    if (count === 1) return name + " 회원";
    return name + " 회원 외 " + (count - 1) + "명";
  }, [profileList]);

  // ! 쿠폰 무료 발급
  const { mutate: giveFreeCoupon } = useMutation(async () => {
    let ask = window.confirm("쿠폰 1장을 무료로 발급하시겠어요?");
    if (!ask) return;

    const { data } = await http.post("/coupon", { USR_SQ });
    if (!data?.result) return alert.error(data?.message);
    alert.success("쿠폰이 1장 발급되었어요.");
  });

  return (
    <>
      {isLoading ? (
        <Skeleton width={200} height={30} style={{ margin: "40px 20px 0" }} />
      ) : (
        <Title title={profileText} />
      )}
      <Container>
        <Header>
          <div>
            {isLoading ? (
              <Skeleton width={120} height={24} />
            ) : (
              <Text>{userInfo?.USR_NO}</Text>
            )}
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton width={160} height={24} />
                <Skeleton width={150} height={24} />
              </>
            ) : (
              <>
                <BigText>총 {totalPaid}원 결제</BigText>
                <BigText>총 {couponCount}장의 쿠폰 보유</BigText>
                <div className="widget">
                  <Button onClick={giveFreeCoupon}>무료 쿠폰발급</Button>
                </div>
              </>
            )}
          </div>
        </Header>
        <Tab
          array={tabList}
          value={activeTab}
          onClick={(val) => setActiveTab(val)}
        />
        <Contents>
          {activeTab === 1 && (
            <Test
              testList={testList}
              profileList={profileList}
              isLoading={testLoading}
            />
          )}
          {activeTab === 2 && (
            <Buy billList={billList} isLoading={billLoading} />
          )}
          {activeTab === 3 && (
            <Use couponList={couponList} isLoading={couponLoading} />
          )}
          {activeTab === 4 && (
            <Family
              profileList={profileList}
              testList={testList}
              isLoading={profileLoading}
            />
          )}
          {activeTab === 5 && <Download USR_SQ={USR_SQ} />}
        </Contents>
      </Container>
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
  flex-direction: column;
  gap: 10px;

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;

    .widget {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
`;

const Contents = styled.div``;
const Text = styled.p`
  font-weight: 500;
`;
const BigText = styled.p`
  font-weight: 600;
  font-size: 18px;
`;
