import styled from "styled-components";
import { c } from "../assets/functions";
import { useMemo } from "react";
import colors from "../assets/colors";
import buttonLoadingImage from "../assets/images/button-loading.png";

interface Props {
  children?: React.ReactNode;
  type?: "button" | "submit";
  onClick?: (e?: any) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  className?: string;
  backgroundColor?: keyof typeof colors;
  color?: keyof typeof colors;
  icon?: JSX.Element;
  borderRadius?: number;
  borderColor?: keyof typeof colors;
  fontWeight?: number;
  style?: React.CSSProperties;
}
const defaultColor: keyof typeof colors = "white";
const defaultBackgroundColor: keyof typeof colors = "main";

/**
 * @name 버튼
 * @param children? React.ReactNode;
 * @param type? "button" | "submit";
 * @param onClick? () => void | Promise<void>;
 * @param loading? boolean;
 * @param disabled? boolean;
 * @param full? boolean;
 * @param className? string;
 * @param color? keyof typeof colors;
 * @param backgroundColor? keyof typeof colors;
 * @param icon? JSX.Element;
 * @param borderRadius? number;
 * @param borderColor? keyof typeof colors;
 * @param fontWeight? number
 * @param style?
 */
export default (props: Props) => {
  const onClick = () => {
    if (props?.loading) return;
    props?.onClick?.();
  };

  const className = useMemo<string>(() => {
    const result = c({
      full: props?.full,
      icon: props?.icon,
      loading: props?.loading,
    });
    if (!props?.className) return result;
    return result + " " + props?.className;
  }, [props?.className, props?.full, props?.icon, props?.loading]);

  return (
    <Container
      type={props?.type}
      onClick={onClick}
      disabled={props?.disabled}
      fontWeight={props?.fontWeight ?? 400}
      className={className}
      backgroundcolor={colors[props?.backgroundColor ?? defaultBackgroundColor]}
      color={colors[props?.color ?? defaultColor]}
      borderradius={props?.borderRadius ?? 1000}
      bordercolor={props?.borderColor ? colors[props?.borderColor] : null}
      style={props?.style}
    >
      {props?.loading ? (
        <LoadingImage size={props?.icon ? 24 : 16} />
      ) : (
        props?.icon || props?.children || "???"
      )}
    </Container>
  );
};

const Container = styled.button<{
  backgroundcolor: string;
  color: string;
  borderradius: number;
  bordercolor: string | null;
  fontWeight: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${(x) =>
    x.bordercolor ? `border: 1px solid ${x.bordercolor};` : "border: none;"}
  padding: 10px 14px;
  letter-spacing: 1px;
  text-indent: 1px;
  border-radius: ${(x) => x?.borderradius}px;
  font-weight: ${(x) => x?.fontWeight};
  transition: 0.1s;
  background-color: ${(x) => x?.backgroundcolor};
  color: ${(x) => x?.color};
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  gap: 5px;

  &.icon {
    padding: 10px;
    aspect-ratio: 1/1;
  }
  &.full {
    width: 100%;
  }
  &.loading {
    cursor: not-allowed;
  }

  &:active {
    background-color: ${(x) => x?.backgroundcolor}cc;
    &.loading {
      background-color: ${(x) => x?.backgroundcolor};
    }
  }
  &:disabled {
    color: ${colors.gray};
    background-color: ${colors.whiteGray};
    opacity: 1;
    cursor: not-allowed;
  }
`;
const LoadingImage = styled.img.attrs({
  src: buttonLoadingImage,
}) <{ size: number }>`
  user-select: none;
  width: ${(x) => x?.size}px;
  height: ${(x) => x?.size}px;
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
