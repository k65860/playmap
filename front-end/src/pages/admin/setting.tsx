import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { settingAtom, userAtom } from "../../assets/atoms";
import Button from "../../layouts/button";
import { useMutation } from "react-query";
import { alert, http } from "../../assets/functions";
import { useEffect, useMemo, useState } from "react";
import FindAddressModal from "../../components/find-address-modal";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import colors from "../../assets/colors";
import ChangePwModal from "./change-pw-modal";
import EditModal from "./edit-modal";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export interface ModalProps {
  key: string;
  name: string;
}

export default () => {
  const nav = useNavigate();
  const user = useRecoilValue(userAtom);
  const setting = useRecoilValue(settingAtom);
  const [editModal, setEditModal] = useState<ModalProps | null>(null);
  const [addressModal, setAddressMoal] = useState<boolean>(false);
  const [isPwModifyModal, setIsPwModifyModal] = useState<boolean>(false);
  const [cookies, , removeCookie] = useCookies(["PLAYMAP_TOKEN"]);

  const joinCode = useMemo(() => {
    return setting?.find((x) => x?.SET_GRP === "ADM_JOIN_CD")?.SET_VAL;
  }, [setting]);

  const { mutate: getnewJoinCode } = useMutation(async () => {
    const ask = window.confirm("신규 코드를 생성하시겠습니까?");
    if (!ask) return;

    const { data } = await http.post("/setting/admin-join-code");
    if (!data?.result) return alert.error(data?.message);
    alert.success("신규 코드가 생성되었습니다.");
  });

  const { mutate: modifyAddr } = useMutation<void, void, string>(
    async (addr) => {
      if (!user?.USR_SQ) return alert.error("로그인이 필요합니다.");
      const body = {
        USR_ADDR: addr,
      };
      const url = `/auth/user/${user?.USR_SQ}`;
      const { data } = await http.put(url, body);
      if (!data?.result) return alert.error(data?.message);
      setAddressMoal(false);
      alert.success("변경되었습니다.");
    }
  );

  const onClick = (key: string, name: string) => {
    setEditModal({ key, name });
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    modifyAddr(fullAddress);
  };

  const logout = () => {
    const ask = window.confirm("로그아웃하시겠어요?");
    if (!ask) return;

    removeCookie("PLAYMAP_TOKEN");
    alert.success("로그아웃 되었습니다.");
    nav("/login");
  };

  return (
    <Container>
      <Contents>
        <Title>보안</Title>
        <Box>
          <Text>
            관리자 가입 코드 : <span className="code">{joinCode}</span>
          </Text>
          <Button onClick={getnewJoinCode}>신규 코드 생성</Button>
        </Box>
      </Contents>
      <Contents>
        <Title>내정보</Title>
        <Box>
          <Text>이름 : {user?.USR_NM}</Text>
          <Button
            icon={<EditRoundedIcon />}
            onClick={() => onClick("USR_NM", "이름")}
          >
            수정
          </Button>
        </Box>
        <Box>
          <Text>연락처 : {user?.USR_NO}</Text>
          <Button
            icon={<EditRoundedIcon />}
            onClick={() => onClick("USR_NO", "연락처")}
          >
            수정
          </Button>
        </Box>
        <Box>
          <Text>이메일 : {user?.USR_MAIL}</Text>
          <Button
            icon={<EditRoundedIcon />}
            onClick={() => onClick("USR_MAIL", "이메일")}
          >
            수정
          </Button>
        </Box>
        <Box>
          <Text>주소 : {user?.USR_ADDR}</Text>
          <Button
            icon={<EditRoundedIcon />}
            onClick={() => setAddressMoal(true)}
          >
            수정
          </Button>
        </Box>
        <Box>
          <Text>상세주소 : {user?.USR_ADDR_DTL}</Text>
          <Button
            icon={<EditRoundedIcon />}
            onClick={() => onClick("USR_ADDR_DTL", "상세주소")}
          >
            수정
          </Button>
        </Box>
        <Box style={{ marginTop: 20 }}>
          <Button full onClick={() => setIsPwModifyModal(true)}>
            비밀번호 변경
          </Button>
        </Box>
      </Contents>
      <Contents>
        <Title>정보</Title>
        <Box>
          <Info>
            <div>최근 접속일 : {user?.USR_LAST_DT}</div>
            <div>CopyRight. 밸런스플레이</div>
          </Info>
        </Box>
      </Contents>

      {editModal && (
        <EditModal editModal={editModal} onClose={() => setEditModal(null)} />
      )}

      {addressModal && (
        <FindAddressModal
          onClose={() => setAddressMoal(false)}
          onClick={handleComplete}
          buttons={
            <>
              <Button
                backgroundColor="gray"
                onClick={() => setAddressMoal(false)}
                full
              >
                닫기
              </Button>
            </>
          }
        />
      )}
      <LogoutBtn onClick={logout}>로그아웃</LogoutBtn>

      {isPwModifyModal && (
        <ChangePwModal onClose={() => setIsPwModifyModal(false)} />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  gap: 15px;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
const Title = styled.h3``;
const Text = styled.p`
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  span.code {
    font-size: 15px;
    font-weight: 900;
    color: ${colors.main};
    letter-spacing: 1px;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  color: #999;
  font-size: 14px;
  gap: 10px;
`;
const LogoutBtn = styled.div`
  margin: 30px auto;
  font-size: 12px;
  color: ${colors.gray};
  text-decoration: underline;
  cursor: pointer;
`;
