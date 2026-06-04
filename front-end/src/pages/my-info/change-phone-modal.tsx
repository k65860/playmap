import { useMutation } from "react-query";
import Button from "../../layouts/button";
import Input from "../../layouts/input";
import Modal from "../../layouts/modal";
import { Div } from "./styles";
import { alert, http, phoneHyphen } from "../../assets/functions";
import { Account } from ".";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../assets/atoms";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  account: Account;
  setAccount: Dispatch<SetStateAction<Account>>;
  closeTelModal: () => void;
  onClose: () => void;
}

export default ({ account, setAccount, closeTelModal, onClose }: Props) => {
  const user = useRecoilValue(userAtom);

  const { mutate: modify } = useMutation(async () => {
    if (!user?.USR_SQ) return alert.error("로그인이 필요합니다.");
    const body = {
      USR_NO: account?.tel,
      USR_ADDR: account?.addr,
    };
    const url = `/auth/user/${user?.USR_SQ}`;
    const { data } = await http.put(url, body);
    if (!data?.result) return alert.error(data?.message);
    onClose();
    alert.success("변경되었습니다.");
    setAccount((prev) => ({ ...prev, tel: account?.tel }));
  });

  // ! onChange 함수
  const onChange = (key: string, value: string) => {
    setAccount((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#change-phone")?.focus();
  }, []);

  return (
    <Modal
      onClose={() => closeTelModal()}
      title="연락처 수정"
      children={
        <Input
          full
          id="change-phone"
          placeholder="연락처를 입력해주세요."
          onChange={(val) => onChange("tel", phoneHyphen(val))}
          maxLength={13}
          value={account?.tel}
        />
      }
      buttons={
        <>
          <Button onClick={() => modify()} full>
            수정
          </Button>
          <Button onClick={() => closeTelModal()} full backgroundColor="gray">
            닫기
          </Button>
        </>
      }
    />
  );
};
