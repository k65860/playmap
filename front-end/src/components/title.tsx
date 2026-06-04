import styled from "styled-components";

interface Props {
  title: string;
  right?: React.ReactNode;
}

export default ({ title, right }: Props) => (
  <Container>
    {title} {right}
  </Container>
);

const Container = styled.h2`
  font-size: 18px;
  font-weight: 900;
  padding: 30px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
