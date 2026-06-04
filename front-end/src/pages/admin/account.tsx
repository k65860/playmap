import { useQuery } from "react-query";
import styled from "styled-components";
import {
  downloadExcel,
  getSearchHangul,
  http,
  range,
} from "../../assets/functions";
import Input from "../../layouts/input";
import { useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import colors from "../../assets/colors";
import moment from "moment";
import Button from "../../layouts/button";
import { commaizeNumber } from "@toss/utils";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

const years: number[] = [];
for (let i = 2024; i <= new Date().getFullYear(); i++) {
  years.unshift(i);
}
const months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default () => {
  const [input, setInput] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(0);

  const onChange = (value: string) => {
    setInput(value);
  };

  const { isLoading, data: billList } = useQuery<Bill[]>(
    ["/bill?USR_SQ=0"],
    async () => {
      const { data } = await http.get("/bill?USR_SQ=0");
      return data?.body ?? [];
    }
  );

  const filterBillList = useMemo(() => {
    let copy = [...(billList ?? [])];

    copy = copy?.filter((x) => {
      if (!x?.PYMT_CRT_DT) return false;
      const date = new Date(x?.PYMT_CRT_DT);
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      return Y === year && (month === 0 ? true : M === month);
    });

    if (input) {
      copy = copy?.filter((x) => {
        return getSearchHangul(x?.USR_ID, input);
      });
    }

    return copy;
  }, [input, billList, year, month]);

  const sum = useMemo<{ won: number; cnt: number }>(() => {
    let won = 0;
    let cnt = 0;
    filterBillList?.forEach((x) => {
      if (!x?.PYMT_SQ) return;
      won += x?.BILL_PRC ?? 0;
      cnt += x?.BILL_CPN_CNT ?? 0;
    });
    return { won, cnt };
  }, [filterBillList]);

  const dtToFormat = (dt: string) => {
    return moment(new Date(dt)).format("YYYY년 MM월 DD일 결제");
  };

  const download = () => {
    const ask = confirm("입출금 내역을 엑셀로 다운로드 받으시겠습니까?");
    if (!ask) return;

    const titles = [
      "회원ID",
      "연락처",
      "청구서 이름",
      "결제금액",
      "결제타입",
      "카드이름",
      "카드번호",
      "결제일시",
    ];
    const rows = filterBillList?.map((x) => [
      x?.USR_ID || "-",
      x?.USR_NO || "-",
      x?.BILL_NM || "-",
      x?.BILL_PRC || "-",
      x?.PYMT_TP || "-",
      x?.PYMT_CRD_TP + " " + x?.PYMT_CRD_NM,
      x?.PYMT_CRD_NO || "-",
      x?.PYMT_CRT_DT || "-",
    ]);
    const fileName =
      year + "년(" + (month === 0 ? "전체" : month + "월") + ")-입출금내역";

    downloadExcel(titles, rows, fileName);
  };

  return (
    <Container>
      <Filter>
        <div>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e?.target?.value))}
          >
            {years?.map((item, i) => (
              <option key={i} value={item}>
                {item}년
              </option>
            ))}
          </Select>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e?.target?.value))}
          >
            {months?.map((item, i) =>
              item === 0 ? (
                <option value={0}>전체</option>
              ) : (
                <option key={i} value={item}>
                  {item}월
                </option>
              )
            )}
          </Select>
        </div>
        {!!filterBillList?.length && (
          <Button onClick={download} icon={<GetAppRoundedIcon />} />
        )}
      </Filter>

      <Header>
        <SumContainer>
          {isLoading ? (
            <>
              <Skeleton width={140} height={34} />
              <Skeleton width={200} height={34} />
            </>
          ) : (
            <>
              총 <span>{commaizeNumber(sum?.won)}</span>원 수익
              <br />총 <span>{commaizeNumber(sum?.cnt)}</span>장의 쿠폰 판매
            </>
          )}
        </SumContainer>
        <Count>
          {isLoading ? <>로딩중</> : <>총 {filterBillList?.length}건</>}
        </Count>
        <Input
          full
          placeholder="검색어를 입력해주세요."
          value={input}
          onChange={onChange}
          disabled={isLoading}
        />
      </Header>
      <Contents>
        {isLoading ? (
          range(5)?.map((x) => (
            <Skeleton key={x} height={70} borderRadius={10} />
          ))
        ) : !filterBillList?.length ? (
          <NoneItem>내역이 없어요.</NoneItem>
        ) : (
          filterBillList?.map((item, index) => (
            <Box key={index}>
              <Left>
                <Text>{item?.USR_ID}</Text>
                <SubText>쿠폰 {item?.BILL_CPN_CNT}개</SubText>
              </Left>
              <Right>
                <SubText className="no">
                  {item?.BILL_PRC ? item?.BILL_PRC?.toLocaleString() : 0}원
                </SubText>
                <SubText>{dtToFormat(item?.BILL_CRT_DT)}</SubText>
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
  gap: 30px;
`;
const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > div {
    display: flex;
    gap: 5px;
  }
`;
const Select = styled.select`
  border: 1px solid ${colors.whiteGray};
  border-radius: 6px;
  height: 36px;
  padding: 0 10px;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.main};
  border-radius: 10px;
  padding: 15px;
`;
const Count = styled.p`
  text-align: end;
  font-size: 14px;
  color: ${colors.main};
`;
const Text = styled.p`
  font-size: 16px;
`;
const SubText = styled.p`
  text-align: end;
  font-size: 12px;
  color: #999;

  &.no {
    font-size: 16px;
    color: ${colors.main};
    font-weight: 900;
  }
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  & > * {
    text-align: left;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;
const NoneItem = styled.div`
  font-size: 14px;
  text-align: center;
  color: #aaa;
`;
const SumContainer = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: ${colors.black};
  line-height: 36px;

  & > span {
    color: ${colors.main};
  }
`;
