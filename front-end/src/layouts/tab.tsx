import styled from "styled-components";
import colors from "../assets/colors";

interface Props {
  array: Array<{ id: number; name: string }>;
  value: number;
  onClick: (val: any) => void;
  disabled?: boolean;
  width?: number;
  activebackgroundcolor?: keyof typeof colors;
  activecolor?: keyof typeof colors;
  backroundcolor?: keyof typeof colors;
  color?: keyof typeof colors;
}

const defaultactivecolor: keyof typeof colors = "white";
const defaultactivebackgroundcolor: keyof typeof colors = "main";
const defaultbackroundcolor: keyof typeof colors = "white";
const defaultcolor: keyof typeof colors = "whiteGray";

export default (props: Props) => {
  return (
    <Container
      backroundcolor={colors[props?.backroundcolor ?? defaultbackroundcolor]}
    >
      {props?.array?.map((item, index) => (
        <Box
          key={index}
          className={item?.id === props?.value ? "active" : ""}
          onClick={() => props?.onClick(item?.id)}
          activebackgroundcolor={
            colors[props?.activebackgroundcolor ?? defaultactivebackgroundcolor]
          }
          activecolor={colors[props?.activecolor ?? defaultactivecolor]}
          backroundcolor={
            colors[props?.backroundcolor ?? defaultbackroundcolor]
          }
          color={colors[props?.color ?? defaultcolor]}
        >
          {item?.name}
        </Box>
      ))}
    </Container>
  );
};
const Container = styled.div<{ backroundcolor: string }>`
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 18px;
  background-color: ${(x) => x?.backroundcolor};
  flex-wrap: wrap;
`;
const Box = styled.div<{
  activebackgroundcolor: string;
  activecolor: string;
  backroundcolor: string;
  color: string;
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  white-space: nowrap;
  cursor: pointer;
  color: ${(x) => x?.color};
  background-color: ${(x) => x?.backroundcolor};
  font-size: 12px;
  border-radius: 25px;

  &.active {
    background-color: ${(x) => x?.activebackgroundcolor};
    color: ${(x) => x?.activecolor};
    border-radius: 25px;
  }
`;
