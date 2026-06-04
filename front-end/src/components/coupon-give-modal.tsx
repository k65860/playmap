import styled from "styled-components";
import { useMutation } from "react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../assets/atoms";
import Modal from "../layouts/modal";
import Button from "../layouts/button";
import Input from "../layouts/input";
import { alert, http } from "../assets/functions";
import { Masker } from "@toss/utils";

interface Props {
  myCount: number;
  onClose: () => void;
}

interface Value {
  USR_JOIN_CD: string;
  CNT: number;
}

export default ({ myCount, onClose }: Props) => {
  const user = useRecoilValue(userAtom);
  const [value, setValue] = useState<Value>({ CNT: 1, USR_JOIN_CD: "" });

  const { isLoading: isGiveSubmitLoading, mutate: giveSubmit } = useMutation<
    void,
    void,
    number,
    void
  >(async (TG_USR_SQ: number) => {
    const url = `/coupon/give`;
    const body = {
      USR_SQ: user?.USR_SQ,
      TG_USR_SQ: TG_USR_SQ,
      CNT: value?.CNT,
    };
    const { data } = await http.post(url, body);
    if (!data?.result) return alert.error(data?.message);

    alert.success("쿠폰 양도가 완료되었어요.");
    onClose();
  });

  const { isLoading: isSearchUserLoading, mutate: searchUser } = useMutation(
    async () => {
      if (!value?.USR_JOIN_CD) {
        document.querySelector<HTMLInputElement>("#value-input")?.focus();
        return;
      }

      const url = `/auth/user?USR_JOIN_CD=${value?.USR_JOIN_CD}`;
      const { data } = await http.get(url);
      if (!data?.result) return alert.error(data?.message);
      if (!data?.body?.length) return alert.warn("회원을 찾을 수 없어요.");

      const targetUser: Common.User = data?.body?.[0];
      let askMsg = Masker.maskPhoneNumber(targetUser?.USR_NO);
      askMsg += " 회원에게 쿠폰을 ";
      askMsg += value?.CNT;
      askMsg += "장 양도하시겠어요?";

      let ask = confirm(askMsg);
      if (!ask) return;

      giveSubmit(targetUser?.USR_SQ);
    }
  );

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#value-input")?.focus();
  }, []);

  return (
    <Modal
      title="쿠폰 양도"
      onClose={() => onClose()}
      buttons={
        <>
          <Button
            loading={isSearchUserLoading || isGiveSubmitLoading}
            full
            onClick={searchUser}
          >
            양도
          </Button>
          <Button backgroundColor="gray" onClick={() => onClose()} full>
            닫기
          </Button>
        </>
      }
    >
      <InputBox>
        <span>
          <Input
            type="number"
            min={1}
            max={myCount}
            value={value?.CNT}
            onChange={(val) =>
              setValue((prev) => ({ ...prev, CNT: Number(val) }))
            }
            width={120}
          />
          <Desc>장</Desc>
        </span>
        <Input
          full
          id="value-input"
          value={value?.USR_JOIN_CD}
          maxLength={12}
          onChange={(val) =>
            setValue((prev) => ({ ...prev, USR_JOIN_CD: val?.toUpperCase() }))
          }
          placeholder="회원의 추천인코드(12자리)를 입력해주세요."
        />
      </InputBox>
    </Modal>
  );
};

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Desc = styled.span`
  margin-left: 6px;
  font-size: 14px;
  color: #999;
`;
