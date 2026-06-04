import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { alert, c, http } from "../assets/functions";
import { NoneItem } from "../pages/admin";
import { useNavigate } from "react-router-dom";
import colors from "../assets/colors";
import { ItemSubTitle } from "../pages/exchange-item/styles";
import Button from "../layouts/button";
import Skeleton from "react-loading-skeleton";

export default () => {
  const nav = useNavigate();

  const {
    isLoading,
    data: exchanges,
    refetch,
  } = useQuery<Exchange.History[]>(["/exchange"], async () => {
    const { data } = await http.get("/exchange");
    return data?.body ?? [];
  });

  const { isLoading: isCheckedLoading, mutate: onChecked } = useMutation(
    async (ECHIS_SQ: number) => {
      const { data } = await http.patch("/exchange/" + ECHIS_SQ);
      if (!data?.result) return alert.error(data?.message);
      refetch();
    }
  );

  const goUser = (USR_SQ: number) => {
    nav("/admin/userinfo", { state: { USR_SQ } });
  };

  return (
    <Conatiner>
      {isLoading ? (
        <>
          <Skeleton
            height={86}
            borderRadius={10}
            style={{ marginBottom: 10 }}
          />
          <Skeleton
            height={86}
            borderRadius={10}
            style={{ marginBottom: 10 }}
          />
        </>
      ) : !exchanges?.length ? (
        <NoneItem>항목이 없어요.</NoneItem>
      ) : (
        exchanges?.map((item) => (
          <Item key={item?.ECHIS_SQ} className={c({ done: !!item?.EC_DONE })}>
            <ItemSubTitle>
              회원이{" "}
              <span style={{ color: colors.orange }}>{item?.ECITM_NM}</span>{" "}
              상품을 교환 신청하였어요.
            </ItemSubTitle>
            <Bottom>
              <ItemDate>{item?.CRT_DT}</ItemDate>
              <Bottom>
                <Button onClick={() => goUser(item?.USR_SQ)}>회원 정보</Button>
                <Button
                  loading={isLoading || isCheckedLoading}
                  onClick={() => onChecked(item?.ECHIS_SQ)}
                  backgroundColor={item?.EC_DONE ? "gray" : "green"}
                >
                  {item?.EC_DONE ? "취소" : "완료"}
                </Button>
              </Bottom>
            </Bottom>
          </Item>
        ))
      )}
    </Conatiner>
  );
};

const Conatiner = styled.div`
  overflow: hidden auto;
  max-height: 80vh;
`;
const Item = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid ${colors.gray}aa;
  border-radius: 10px;

  &.done {
    border-color: ${colors.green};
  }
`;
const ItemDate = styled.div`
  font-size: 12px;
  color: ${colors.whiteGray};
`;
const Bottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
`;
