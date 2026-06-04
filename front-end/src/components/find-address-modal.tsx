import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";

interface Props {
  children?: React.ReactNode;
  buttons?: React.ReactNode;
  onClose?: () => void;
  onClick: (data: any) => void;
}

export default (props: Props) => {
  return (
    <>
      <Dim onClick={props?.onClose}></Dim>
      <Container>
        <DaumPostcode onComplete={props?.onClick} autoClose={false} />
        <Bottom>{props?.buttons}</Bottom>
      </Container>
    </>
  );
};

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Container = styled.div`
  background-color: #fff;
  z-index: 1000;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
`;
const Bottom = styled.div`
  height: 60px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
