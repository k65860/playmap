import styled from "styled-components";
import colors from "../assets/colors";
import { c } from "../assets/functions";
import toggleLoadingImage from "../assets/images/toggle-loading.png";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  activeColor?: "green" | "red" | "orange";
}

const COLORS = {
  green: "#06b259",
  red: "#f0513f",
  orange: "#f59f14",
};

/**
 * @name 체크박스
 * @param value boolean
 * @param onChange (value: boolean) => void | Promise<void>
 * @param loading? boolean
 * @param disabled? boolean
 * @param activeColor? 'green' | 'red' | 'orange'
 */
export default (props: Props) => {
  const onChange = () => {
    if (props?.loading || props?.disabled) return;
    props?.onChange?.(!props?.value);
  };

  return (
    <Container
      className={c({
        loading: props?.loading,
        disabled: props?.disabled,
        active: props?.value,
      })}
      color={COLORS[props?.activeColor ?? "green"]}
      onClick={onChange}
    >
      <Circle className={c({ active: props?.value })}>
        {!!props?.loading && <LoadingImage />}
      </Circle>
    </Container>
  );
};

const Container = styled.div`
  display: inline-block;
  width: 39px;
  height: 24px;
  padding: 2px;
  border-radius: 100px;
  transition: 0.3s;
  border: #e2e2e2;
  background-color: #dddddd;
  box-shadow: 0 1px 1px ${colors.dim};
  cursor: pointer;

  &.loading,
  &.disabled {
    cursor: not-allowed;
  }
  &.disabled {
    box-shadow: none;
    background-color: #cccccc;
  }
  &.active {
    background-color: ${(x) => x?.color};
  }
`;
const Circle = styled.div`
  height: 100%;
  aspect-ratio: 1/1;
  background-color: #ffffff;
  border-radius: 50%;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    transform: translateX(calc(100% - 25%));
  }
`;
const LoadingImage = styled.img.attrs({
  src: toggleLoadingImage,
})`
  user-select: none;
  width: 12px;
  height: 12px;
  object-fit: contain;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
