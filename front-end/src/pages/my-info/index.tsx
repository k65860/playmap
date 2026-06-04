import Button from "../../layouts/button";
import { useRecoilValue } from "recoil";
import { settingAtom, userAtom } from "../../assets/atoms";
import { useEffect, useMemo, useState } from "react";
import Modal from "../../layouts/modal";
import { useMutation } from "react-query";
import { alert, http } from "../../assets/functions";
import copy from "clipboard-copy";
import FindAddressModal from "../../components/find-address-modal";
import { useCookies } from "react-cookie";
import Title from "../../components/title";
import ChangePhoneModal from "./change-phone-modal";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import {
  Box,
  Container,
  Contents,
  DeleteAccountText,
  Desc,
  JoinOutBtn,
  SubText,
} from "./styles";
import ChangePwModal from "./change-pw-modal";
import { useNavigate } from "react-router-dom";

export interface Account {
  tel: string;
  addr: string;
  pw: string;
}

export default () => {
  const nav = useNavigate();
  const user = useRecoilValue(userAtom);
  const setting = useRecoilValue(settingAtom);
  const [, , removeCookie] = useCookies(["PLAYMAP_TOKEN"]);
  const [account, setAccount] = useState<Account>({
    tel: "",
    addr: "",
    pw: "",
  });
  const [isTelModifyModal, setIsTelModifyModal] = useState<boolean>(false);
  const [isPwModifyModal, setIsPwModifyModal] = useState<boolean>(false);
  const [isAddrModifyModal, setIsAddrModifyModal] = useState<boolean>(false);
  const [isDeleteAccountModal, setIsDeleteAccountModal] =
    useState<boolean>(false);

  const { mutate: modifyAddr } = useMutation<void, void, string>(
    async (addr) => {
      if (!user?.USR_SQ) return alert.error("로그인이 필요합니다.");
      const body = {
        USR_ADDR: addr,
      };
      const { data } = await http.put(`/auth/user/${user?.USR_SQ}`, body);
      if (!data?.result) return alert.error(data?.message);
      setIsAddrModifyModal(false);
      alert.success("변경되었습니다.");
      // queryClient.invalidateQueries(`/auth/user/${user?.USR_SQ}`);
    }
  );

  const { mutate: signout } = useMutation(async () => {
    const ask = confirm("정말 탈퇴하시겠어요?");
    if (!ask) return;

    const { data } = await http.delete(`/auth/signout/${user?.USR_SQ}`);
    if (!data?.result) return alert.error(data?.message);
    removeCookie("PLAYMAP_TOKEN");
    alert.success("탈퇴되었습니다.");
  });

  // ! 연락처 수정 모달 닫기 함수
  const closeTelModal = () => {
    setIsTelModifyModal(false);
    setAccount((prev) => {
      return {
        ...prev,
        tel: user?.USR_NO,
      };
    });
  };

  // ! 추천인 코드 복사
  const copyCode = () => {
    copy(user?.USR_JOIN_CD);
    alert.success("복사가 완료되었습니다.");
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
    setAccount((prev) => ({ ...prev, addr: fullAddress }));
    modifyAddr(fullAddress);
  };

  const DeleteAccountDesc = useMemo(() => {
    return setting?.find((x) => x?.SET_GRP === "SIGNOUT_TERMS")?.SET_VAL ?? "-";
  }, [setting]);

  useEffect(() => {
    setAccount((prev) => {
      return {
        ...prev,
        tel: user?.USR_NO,
        addr: user?.USR_ADDR,
      };
    });
  }, [user]);

  return (
    <>
      <Title title="내 정보" />
      <Container>
        <Contents>
          <Box>
            <div>
              <p>연락처 :</p>
              <SubText>{user?.USR_NO}</SubText>
            </div>
            <Button
              icon={<EditRoundedIcon />}
              onClick={() => setIsTelModifyModal(true)}
            />
          </Box>
          <Box>
            <div>
              <p>주소 :</p>
              <SubText>{user?.USR_ADDR}</SubText>
            </div>
            <Button
              icon={<EditRoundedIcon />}
              onClick={() => setIsAddrModifyModal(true)}
            />
          </Box>
        </Contents>

        <Contents>
          <Box>
            <div>
              <p>추천인코드 :</p>
              <SubText>{user?.USR_JOIN_CD}</SubText>
            </div>
            <Button icon={<ContentCopyRoundedIcon />} onClick={copyCode} />
          </Box>
        </Contents>

        <Contents>
          <Box>
            <div>
              <span>추천인 등록 수 :</span>
              <SubText>{user?.USR_JOIN_CNT ?? 0}명</SubText>
            </div>
            <Button
              icon={<CurrencyExchangeRoundedIcon />}
              onClick={() => nav("/exchangeitem")}
            />
          </Box>
          <Box>
            <Desc>추천인 등록 수에 따라 상품을 교환 할 수 있어요.</Desc>
          </Box>
          <Box></Box>
        </Contents>

        <Contents>
          <Button onClick={() => setIsPwModifyModal(true)}>
            비밀번호 변경
          </Button>
        </Contents>

        <hr />

        <Contents>
          <Box>
            <div>
              <span>최근 접속일 :</span>
              <SubText>{user?.USR_LAST_DT}</SubText>
            </div>
          </Box>
          <Box>
            <div>
              <SubText>CopyRight. </SubText>
              <SubText>밸런스플레이</SubText>
            </div>
          </Box>
        </Contents>

        <br />
        <JoinOutBtn onClick={() => setIsDeleteAccountModal(true)}>
          탈퇴
        </JoinOutBtn>

        {isTelModifyModal && (
          <ChangePhoneModal
            {...{
              account,
              setAccount,
              closeTelModal,
              onClose: () => setIsTelModifyModal(false),
            }}
          />
        )}

        {isAddrModifyModal && (
          <FindAddressModal
            onClose={() => setIsAddrModifyModal(false)}
            onClick={handleComplete}
            buttons={
              <>
                <Button
                  backgroundColor="gray"
                  onClick={() => setIsAddrModifyModal(false)}
                  full
                >
                  닫기
                </Button>
              </>
            }
          />
        )}

        {isPwModifyModal && (
          <ChangePwModal {...{ onClose: () => setIsPwModifyModal(false) }} />
        )}

        {isDeleteAccountModal && (
          <Modal
            onClose={() => setIsDeleteAccountModal(false)}
            title="회원탈퇴"
            buttons={
              <>
                <Button backgroundColor="red" onClick={() => signout()} full>
                  탈퇴
                </Button>
                <Button
                  backgroundColor="gray"
                  onClick={() => setIsDeleteAccountModal(false)}
                  full
                >
                  닫기
                </Button>
              </>
            }
          >
            <>
              <DeleteAccountText>{DeleteAccountDesc}</DeleteAccountText>
            </>
          </Modal>
        )}
      </Container>
    </>
  );
};
