import { useQuery } from "react-query";
import styled from "styled-components";
import { getSearchHangul, http, range } from "../../assets/functions";
import Input from "../../layouts/input";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import colors from "../../assets/colors";
import moment from "moment";

export default () => {
  const nav = useNavigate();
  const [input, setInput] = useState<string>("");

  const onChange = (value: string) => {
    setInput(value);
  };

  const { isLoading, data: userList } = useQuery<Common.Profile[]>(
    ["/profile"],
    async () => {
      const { data } = await http.get("/profile?USR_SQ=0");
      return data?.body ?? [];
    }
  );

  const filterUserList = useMemo(() => {
    if (!input) return userList;
    return userList?.filter((x) => {
      const findName = getSearchHangul(x?.PRF_NM, input);
      const findNo = getSearchHangul(
        x?.USR_NO?.replace(/-/g, ""),
        input?.replace(/-/g, "")
      );
      return findName || findNo;
    });
  }, [input, userList]);

  const dtToFormat = (dt: string) => {
    return moment(new Date(dt)).format("YYYY년 MM월 DD일 가입");
  };

  return (
    <Container>
      <Header>
        <Count>
          {isLoading ? <>로딩중</> : <>총 {filterUserList?.length}명</>}
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
        {isLoading
          ? range(5)?.map((x) => (
              <Skeleton key={x} height={70} borderRadius={10} />
            ))
          : filterUserList?.map((user, index) => (
              <Box
                key={index}
                onClick={() =>
                  nav("/admin/userinfo", { state: { USR_SQ: user?.USR_SQ } })
                }
              >
                <Left>
                  <Text>{user?.PRF_NM}</Text>
                </Left>
                <Right>
                  <SubText className="no">{user?.USR_NO}</SubText>
                  <SubText>{dtToFormat(user?.CRT_DT)}</SubText>
                </Right>
              </Box>
            ))}
      </Contents>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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
  padding-bottom: 100px;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.main};
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
`;
const Count = styled.p`
  text-align: end;
  font-size: 14px;
  color: ${colors.main};
`;
const Text = styled.p`
  font-size: 15px;
  font-weight: 700;
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
  align-items: center;
  gap: 10px;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;
