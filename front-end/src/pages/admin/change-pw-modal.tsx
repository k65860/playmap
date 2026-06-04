import styled from "styled-components";
import Modal from "../../layouts/modal";
import Button from "../../layouts/button";
import Input from "../../layouts/input";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../assets/atoms";
import { alert, http } from "../../assets/functions";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
}

export default ({ onClose }: Props) => {
  const user = useRecoilValue(userAtom);
  const [pw, setPw] = useState({
    pw: "",
    newPw: "",
    newPwCfm: "",
  });

  const onChangePw = (key: string, value: string) => {
    setPw((prev) => ({ ...prev, [key]: value }));
  };

  const { isLoading, mutate: pwChange } = useMutation(async () => {
    if (!user?.USR_SQ) return alert.error("로그인이 필요합니다.");
    if (!pw?.pw || !pw?.newPw || !pw?.newPwCfm) {
      return alert.warn("모든 항목을 입력해주세요.");
    }

    const body = {
      USR_SQ: user?.USR_SQ,
      USR_PW: pw?.pw,
      NEW_USR_PW: pw?.newPw,
      NEW_USR_PW_CFM: pw?.newPwCfm,
    };
    const { data } = await http.put("/auth/pw", body);
    if (!data?.result) return alert.error(data?.message);
    onClose();
    alert.success("변경되었습니다.");
    setPw({
      pw: "",
      newPw: "",
      newPwCfm: "",
    });
  });

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#change-pw")?.focus();
  }, []);

  return (
    <Modal
      title="비밀번호 변경"
      onClose={() => {
        onClose();
        setPw({
          pw: "",
          newPw: "",
          newPwCfm: "",
        });
      }}
      children={
        <Div>
          <Input
            full
            id="change-pw"
            placeholder="기존 비밀번호를 입력해주세요."
            onChange={(e) => onChangePw("pw", e)}
            maxLength={11}
            type="password"
            value={pw?.pw}
          />
          <br />
          <br />
          <Input
            full
            placeholder="사용할 비밀번호를 입력해주세요."
            onChange={(e) => onChangePw("newPw", e)}
            maxLength={11}
            type="password"
            value={pw?.newPw}
          />
          <Input
            full
            placeholder="사용할 비밀번호를 다시 입력해주세요."
            onChange={(e) => onChangePw("newPwCfm", e)}
            maxLength={11}
            type="password"
            value={pw?.newPwCfm}
          />
        </Div>
      }
      buttons={
        <>
          <Button loading={isLoading} onClick={() => pwChange()} full>
            수정
          </Button>
          <Button
            onClick={() => {
              onClose();
              setPw({
                pw: "",
                newPw: "",
                newPwCfm: "",
              });
            }}
            full
            backgroundColor="gray"
          >
            닫기
          </Button>
        </>
      }
    />
  );
};

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 0;
`;
