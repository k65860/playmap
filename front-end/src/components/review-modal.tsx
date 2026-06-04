import styled from "styled-components";
import Button from "../layouts/button";
import Modal from "../layouts/modal";
import colors from "../assets/colors";
import { maskName } from "@toss/utils";

interface Props {
  reviews: Common.Review[];
  onClose: () => void;
}

export default ({ reviews, onClose }: Props) => {
  const replaceStart = (name: string) => {
    if (name?.indexOf("**") === -1) return name;
    return replaceStart(name?.replace(/\*\*/g, "*"));
  };

  const getViewName = (name: string) => {
    let result = maskName(name);
    result = replaceStart(result);
    return result;
  };

  return (
    <Modal
      title={"리뷰 전체 보기 (" + reviews?.length + "개)"}
      onClose={onClose}
      buttons={
        <>
          <Button backgroundColor="gray" onClick={onClose} full>
            닫기
          </Button>
        </>
      }
    >
      <Container>
        {reviews?.map((review: Common.Review) => (
          <Item key={review?.TEST_SQ}>
            <Image src={review?.CHAR_IMG_PATH} />
            <Text>
              <Title>{review?.TEST_RVW}</Title>
              <Desc>
                {review?.TEST_TP_NM} | {getViewName(review?.PRF_NM)}
                <br />
                {review?.MOD_DT}
              </Desc>
            </Text>
          </Item>
        ))}
      </Container>
    </Modal>
  );
};

const Container = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
  overflow: auto;
`;
const Item = styled.li`
  border-left: 4px solid ${colors.main}aa;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #333;
  white-space: break-spaces;
`;
const Desc = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 6px;
`;
const Image = styled.img`
  object-fit: contain;
  height: 60px;
`;
const Text = styled.div`
  flex: 1;
`;
