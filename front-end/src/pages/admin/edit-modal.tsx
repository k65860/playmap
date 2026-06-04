import { useMutation } from "react-query";
import Button from "../../layouts/button";
import Input from "../../layouts/input";
import Modal from "../../layouts/modal";
import { Contents, ModalProps } from "./setting";
import { alert, http } from "../../assets/functions";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../assets/atoms";
import { useEffect, useState } from "react";

interface Props {
  editModal: ModalProps;
  onClose: () => void;
}
interface InputType {
  [key: string]: string; // 모든 키가 string 타입의 값을 갖도록 설정
  USR_NM: string;
  USR_NO: string;
  USR_MAIL: string;
  USR_ADDR_DTL: string;
}

export default ({ editModal, onClose }: Props) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [input, setInput] = useState<InputType>({
    USR_NM: "",
    USR_NO: "",
    USR_MAIL: "",
    USR_ADDR_DTL: "",
  });

  const { isLoading, mutate: modifyInfo } = useMutation(async () => {
    const body = {
      USR_NM: input?.USR_NM,
      USR_NO: input?.USR_NO,
      USR_MAIL: input?.USR_MAIL,
      USR_ADDR_DTL: input?.USR_ADDR_DTL,
    };
    const url = `/auth/user/${user?.USR_SQ}`;
    const { data } = await http.put(url, body);
    if (!data?.result) return alert.error(data?.message);
    onClose();
    setUser((prev) => ({
      ...prev,
      USR_NM: input?.USR_NM,
      USR_NO: input?.USR_NO,
      USR_MAIL: input?.USR_MAIL,
      USR_ADDR_DTL: input?.USR_ADDR_DTL,
    }));

    alert.success("수정되었습니다.");
  });

  const onChange = (key: string, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!user) return;
    setInput({
      USR_NM: user?.USR_NM,
      USR_NO: user?.USR_NO,
      USR_MAIL: user?.USR_MAIL,
      USR_ADDR_DTL: user?.USR_ADDR_DTL,
    });
  }, [user]);

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#edit-input")?.focus();
  }, []);

  return (
    <Modal
      onClose={onClose}
      title={editModal?.name + " 수정"}
      buttons={
        <>
          <Button loading={isLoading} onClick={modifyInfo} full>
            수정
          </Button>
          <Button backgroundColor="gray" onClick={onClose} full>
            닫기
          </Button>
        </>
      }
    >
      <Contents>
        <Input
          full
          id="edit-input"
          value={input?.[editModal?.key]}
          onChange={(e) => onChange(editModal?.key, e)}
        />
      </Contents>
    </Modal>
  );
};
