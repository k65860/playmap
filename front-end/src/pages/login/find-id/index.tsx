import Button from "../../../layouts/button";
import Modal from "../../../layouts/modal";
import { Description, Div, FindIdContainer } from "../styles";
import Input from "../../../layouts/input";
import { alert, http, phoneHyphen } from "../../../assets/functions";
import { useMutation } from "react-query";
import { useEffect, useState } from "react";
import { commaizeNumber } from "@toss/utils";

interface FindAccount {
  email: string;
  tel: string;
}

interface Props {
  onClose: () => void;
}

export default ({ onClose }: Props) => {
  const [findIdResult, setFindIdResult] = useState<string[]>([]);
  const [findAccount, setFindAccount] = useState<FindAccount>({
    email: "",
    tel: "",
  });

  // ! 아이디 찾기 함수
  const { isLoading: findIdLoading, mutate: findId } = useMutation(async () => {
    if (!findAccount?.email) return alert.error("이메일을 입력해주세요.");
    if (!findAccount?.tel) return alert.error("연락처를 입력해주세요.");
    const body = {
      USR_MAIL: findAccount?.email,
      USR_NO: findAccount?.tel,
    };
    const { data } = await http.post("/auth/find-id", body);
    if (!data?.result) return alert.error(data?.message);
    setFindIdResult(data?.body?.REASON);
  });

  // ! 아이디찾기 onChange
  const onFindAccountChange = (key: "email" | "tel", value: string) => {
    setFindAccount((prev) => ({
      ...prev,
      [key]: key === "tel" ? phoneHyphen(value) : value,
    }));
  };

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#find-id-email")?.focus();
  }, []);

  return (
    <Modal
      title="아이디 찾기"
      onClose={onClose}
      children={
        <FindIdContainer>
          <Input
            id="find-id-email"
            full
            type="email"
            value={findAccount?.email}
            placeholder="이메일을 입력해주세요."
            onChange={(e) => onFindAccountChange("email", e)}
          />
          <Input
            full
            value={findAccount?.tel}
            placeholder="연락처를 입력해주세요."
            onChange={(e) => onFindAccountChange("tel", e)}
          />
          <Div>
            {findIdResult?.map((item: string, index: number) => (
              <Description key={index}>{item}</Description>
            ))}
          </Div>
        </FindIdContainer>
      }
      buttons={
        <>
          <Button onClick={findId} full loading={findIdLoading}>
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
