import { useEffect, useState } from "react";
import Button from "../../../layouts/button";
import Input from "../../../layouts/input";
import Modal from "../../../layouts/modal";
import { Description, FindIdContainer } from "../styles";
import { alert, http, phoneHyphen } from "../../../assets/functions";
import { useMutation } from "react-query";

interface TempPw {
  id: string;
  email: string;
  tel: string;
}
interface Props {
  onClose: () => void;
}

export default ({ onClose }: Props) => {
  const [tempPw, setTempPw] = useState<TempPw>({
    id: "",
    email: "",
    tel: "",
  });

  // ! 임시비밀번호발급 onChange
  const onTempPwChange = (key: "id" | "email" | "tel", value: string) => {
    setTempPw((prev) => ({
      ...prev,
      [key]: key === "tel" ? phoneHyphen(value) : value,
    }));
  };

  // ! 임시 비밀번호 발급 함수
  const { isLoading: getTempPwLoading, mutate: getTempPw } = useMutation(
    async () => {
      if (!tempPw?.id) return alert.error("아이디 입력해주세요.");
      if (!tempPw?.email) return alert.error("비밀번호 입력해주세요.");
      if (!tempPw?.tel) return alert.error("연락처를 입력해주세요.");
      const body = {
        USR_MAIL: tempPw?.email,
        USR_NO: tempPw?.tel,
        USR_ID: tempPw?.id,
      };

      const { data } = await http.post("/auth/find-pw", body);
      if (!data?.result) return alert.error(data?.message);
      alert.success("이메일로 임시 비밀번호가 발급되었어요.");
      onClose();
    }
  );

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#find-pw-id")?.focus();
  }, []);

  return (
    <Modal
      title="임시 비밀번호 발급"
      onClose={onClose}
      children={
        <FindIdContainer>
          <Description>
            임시 비밀번호는 등록된 이메일로 전송됩니다. 이메일을 사용할 수
            없거나 이메일이 오지않을 경우{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => (location.href = "tel:010-0000-0000")}
            >
              고객센터
            </span>
            에 문의해주세요.
          </Description>
          <Input
            full
            id="find-pw-id"
            value={tempPw?.id}
            placeholder="아이디을 입력해주세요."
            onChange={(e) => onTempPwChange("id", e)}
          />
          <Input
            full
            type="email"
            value={tempPw?.email}
            placeholder="이메일을 입력해주세요."
            onChange={(e) => onTempPwChange("email", e)}
          />
          <Input
            full
            value={tempPw?.tel}
            placeholder="연락처를 입력해주세요."
            onChange={(e) => onTempPwChange("tel", e)}
          />
        </FindIdContainer>
      }
      buttons={
        <>
          <Button onClick={getTempPw} full loading={getTempPwLoading}>
            찾기
          </Button>
          <Button backgroundColor="gray" onClick={onClose} full>
            닫기
          </Button>
        </>
      }
    />
  );
};
