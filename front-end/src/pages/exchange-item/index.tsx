import { useRecoilValue } from "recoil";
import { userAtom } from "../../assets/atoms";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { alert, http } from "../../assets/functions";
import Title from "../../components/title";
import {
  Bottom,
  Box,
  Container,
  Item,
  ItemContent,
  ItemList,
  ItemSubTitle,
  ItemTitle,
  SubText,
} from "./styles";
import Button from "../../layouts/button";
import { NoneItem } from "../admin";
import Skeleton from "react-loading-skeleton";
import { useMemo } from "react";

export default () => {
  const user = useRecoilValue(userAtom);
  const queryClient = useQueryClient();

  const myJoinCount = useMemo<number>(() => {
    return user?.USR_JOIN_CNT ?? 0;
  }, [user]);

  const { isLoading, data: exchangeItems } = useQuery<Exchange.Item[]>(
    ["/exchange/item"],
    async () => {
      const { data } = await http.get("/exchange/item");
      return data?.body ?? [];
    }
  );

  const { isLoading: isExchangeLoading, mutate: onExchange } = useMutation(
    async (item: Exchange.Item) => {
      let askMsg = "해당 상품으로 교환을 신청하시겠어요?\n";
      askMsg += "신청 전 추천인 등록 수 : ";
      askMsg += myJoinCount + "명\n";
      askMsg += "신청 후 추천인 등록 수 : ";
      askMsg += myJoinCount - item?.ECITM_JOIN_CNT + "명\n";
      const ask = confirm(askMsg);
      if (!ask) return;

      const form = {
        ECITM_SQ: item?.ECITM_SQ,
        USR_SQ: user?.USR_SQ,
      };
      const { data } = await http.post("/exchange", form);
      if (!data?.result) return alert.error(data?.message);
      alert.success("신청되었어요.");

      queryClient.invalidateQueries(["/auth/user/" + user?.USR_SQ]);
    }
  );

  return (
    <>
      <Title title="추천인 교환 상품" />
      <Container>
        <Box>
          <div>
            <span>추천인 등록 수 :</span>
            <SubText>{isLoading ? "로딩중.." : myJoinCount + "명"}</SubText>
          </div>
        </Box>
        <ItemList>
          {isLoading ? (
            <>
              <Skeleton
                height={161}
                borderRadius={10}
                style={{ marginBottom: 10 }}
              />
              <Skeleton
                height={161}
                borderRadius={10}
                style={{ marginBottom: 10 }}
              />
            </>
          ) : !exchangeItems?.length ? (
            <NoneItem>항목이 없어요.</NoneItem>
          ) : (
            exchangeItems?.map((item) => (
              <Item key={item?.ECITM_SQ}>
                <ItemTitle>{item?.ECITM_NM}</ItemTitle>
                <ItemSubTitle>
                  차감 추천인 수: {item?.ECITM_JOIN_CNT}명
                </ItemSubTitle>
                <ItemContent>{item?.ECITM_CN}</ItemContent>
                <Bottom>
                  <Button
                    loading={isExchangeLoading}
                    disabled={
                      !!item?.ECITM_STOP || myJoinCount < item?.ECITM_JOIN_CNT
                    }
                    onClick={() => onExchange(item)}
                  >
                    {item?.ECITM_STOP
                      ? "교환불가"
                      : myJoinCount < item?.ECITM_JOIN_CNT
                      ? "추천인 수 부족"
                      : "교환신청"}
                  </Button>
                </Bottom>
              </Item>
            ))
          )}
        </ItemList>
      </Container>
    </>
  );
};
