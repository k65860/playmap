import styled from "styled-components";
import Button from "../../layouts/button";
import Modal from "../../layouts/modal";
import Input from "../../layouts/input";
import { alert, http } from "../../assets/functions";
import { useMutation } from "react-query";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  result: any;
  targetTestSq: number;
  onClose: () => void;
  reviewValue: string;
  setReviewValue: Dispatch<SetStateAction<string>>;
}

export default ({
  result,
  targetTestSq,
  onClose,
  reviewValue,
  setReviewValue,
}: Props) => {
  const { isLoading, mutate: postReview } = useMutation(async () => {
    if (!reviewValue) {
      document.querySelector<HTMLInputElement>("#review-input")?.focus();
      return alert.warn("리뷰를 작성해주세요.");
    }

    const body = {
      TEST_RVW: reviewValue,
    };
    const { data } = await http.post(`/test/${targetTestSq}/review`, body);
    if (!data?.result) return alert.error(data?.message);
    onClose();
    alert.success("완료되었어요.");
  });

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#review-input")?.focus();
  }, []);

  return (
    <Modal
      onClose={() => onClose()}
      title={"리뷰 " + (!result?.TEST_RVW ? "작성" : "수정")}
      buttons={
        <>
          <Button loading={isLoading} full onClick={postReview}>
            작성완료
          </Button>
          <Button backgroundColor="gray" onClick={() => onClose()} full>
            닫기
          </Button>
        </>
      }
    >
      <InputBox>
        <Input
          full
          id="review-input"
          type="textarea"
          value={reviewValue}
          onChange={(e) => setReviewValue(e)}
          placeholder="리뷰를 작성해주세요."
        />
      </InputBox>
    </Modal>
  );
};

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;
