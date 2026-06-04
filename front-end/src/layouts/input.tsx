import styled from "styled-components";
import colors from "../assets/colors";
import { c } from "../assets/functions";
import { ChangeEvent, useMemo } from "react";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

interface Props {
  id?: string;
  type?:
    | "text"
    | "tel"
    | "email"
    | "number"
    | "textarea"
    | "password"
    | "date"
    | "time";
  value: string | number;
  onChange?: (value: string) => void | Promise<void>;
  disabled?: boolean;
  width?: number;
  height?: number;
  reactiveWidth?: number;
  minLength?: number;
  maxLength?: number;
  full?: boolean;
  length?: boolean;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  flex?: boolean;
}

/**
 * @name 입력박스
 * @param id?: string
 * @param type?: 'text' | 'tel' | 'email' | 'number' | 'textarea' | 'password' | 'date' | 'time'
 * @param value string | number
 * @param onChange? (value: string) => void | Promise<void>
 * @param disabled? boolean
 * @param width? number
 * @param height? number
 * @param reactiveWidth? number
 * @param minLength? number
 * @param maxLength? number
 * @param full? boolean
 * @param length? boolean
 * @param placeholder? string
 * @param required? boolean
 * @param min? number
 * @param max? number
 * @param flex? boolean
 */
export default (props: Props) => {
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (props?.disabled || !props?.onChange) return;

    if (props?.type === "number") {
      const value = Number(e?.target?.value);
      if (props?.min !== undefined && value < props?.min) {
        e.target.value = props?.min.toString();
      }
      if (props?.max !== undefined && value > props?.max) {
        e.target.value = props?.max.toString();
      }
    }

    props?.onChange(e?.target?.value);
  };

  const onClick = (val: number) => {
    if (props?.disabled || !props?.onChange || props?.type !== "number") return;
    const value = Number(props?.value);
    if (val < 0 && props?.min !== undefined && value <= props?.min) {
      props?.onChange(props?.min.toString());
      return;
    }
    if (val > 0 && props?.max !== undefined && value >= props?.max) {
      props?.onChange(props?.max.toString());
      return;
    }
    props?.onChange((value + val).toString());
  };

  const length = useMemo<number>(() => {
    const count = props?.value?.toString()?.length ?? 0;
    if (props?.maxLength && count > props?.maxLength) {
      return props?.maxLength;
    }
    return count;
  }, [props?.maxLength, props?.value]);

  return (
    <Container width={props?.width} flex={props?.flex ?? false}>
      {props?.type === "textarea" ? (
        <Textarea
          id={props?.id}
          width={props?.width}
          height={props?.height}
          value={props?.value ?? ""}
          minLength={props?.minLength}
          maxLength={props?.maxLength}
          required={props?.required ?? false}
          disabled={props?.disabled}
          onChange={onChange}
          placeholder={props?.placeholder ?? ""}
          className={c({
            disabled: props?.disabled,
            react: props?.reactiveWidth,
            full: props?.full,
          })}
        />
      ) : (
        <Input
          id={props?.id}
          type={props?.type ?? "text"}
          width={props?.width}
          height={props?.height}
          value={props?.value ?? ""}
          react={props?.reactiveWidth ?? 0}
          required={props?.required ?? false}
          minLength={props?.minLength}
          maxLength={props?.maxLength}
          disabled={props?.disabled}
          placeholder={props?.placeholder ?? ""}
          onChange={onChange}
          className={c({
            disabled: props?.disabled,
            react: props?.reactiveWidth,
            full: props?.full,
          })}
          min={props?.min}
          max={props?.max}
        />
      )}
      {!!props?.length && (
        <Length
          right={props?.type === "textarea" ? 8 : 14}
          className={c({
            full: props?.maxLength && props?.maxLength === length,
          })}
        >
          {length}
          {props?.maxLength ? "/" + props?.maxLength : ""}자
        </Length>
      )}
      {props?.type === "number" && (
        <SpinButtonContainer>
          <SpinButton type="button" className="top" onClick={() => onClick(1)}>
            <ArrowDropUpRoundedIcon />
          </SpinButton>
          <SpinButton
            type="button"
            className="bottom"
            onClick={() => onClick(-1)}
          >
            <ArrowDropDownRoundedIcon />
          </SpinButton>
        </SpinButtonContainer>
      )}
    </Container>
  );
};

const Container = styled.div<{ width?: number; flex: boolean }>`
  position: relative;
  display: inline-block;
  margin: 4px;
  ${(props) => props.flex && "flex: 1;"}
  width: ${(x) => (x?.width ? x?.width + "px" : "calc(100% - 8px)")};
  &.full {
    width: calc(100% - 8px);
  }
`;
const Input = styled.input<{ react: number }>`
  display: block;
  width: 100%;
  height: ${(x) => x?.height ?? 40}px;
  padding: 0 14px;
  font-size: 14px;
  border-radius: 100px;
  transition: 0.3s;
  outline: none;
  border: 1px solid #eeeeee;
  background-color: #f0f0f0;
  box-shadow: 0 1px 1px ${colors.dim};

  &[type="number"]::-webkit-inner-spin-button {
    appearance: none;
  }

  &:focus {
    border-color: ${colors.blue}60;
    box-shadow: 0 0 2px 2px ${colors.blue}40;
  }
  &.disabled {
    cursor: not-allowed;
    box-shadow: none;
    background-color: #dddddd;
    color: #555555;
  }
  &.react:focus {
    width: ${(x) => x?.react}px;
  }
  &.full {
    width: 100%;
  }
`;
const Textarea = styled.textarea<{ width?: number; height?: number }>`
  width: ${(x) => x?.width ?? 300}px;
  height: ${(x) => x?.height ?? 100}px;
  display: block;
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  transition: 0.3s;
  outline: none;
  border: 1px solid #eeeeee;
  background-color: #f0f0f0;
  box-shadow: 0 1px 1px ${colors.dim};
  resize: none;

  &:focus {
    border-color: ${colors.blue}60;
    box-shadow: 0 0 2px 2px ${colors.blue}40;
  }
  &.disabled {
    cursor: not-allowed;
    box-shadow: none;
    background-color: #dddddd;
    color: #555555;
  }
  &.full {
    width: 100%;
  }
`;
const Length = styled.div<{ right: number }>`
  position: absolute;
  right: ${(x) => x?.right}px;
  top: calc(100% + 4px);
  font-size: 10px;
  color: #aaaaaa;

  &.full {
    color: ${colors.green};
    font-weight: 500;
  }
`;
const SpinButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1px;
`;
const SpinButton = styled.button`
  width: 100%;
  height: 50%;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  cursor: pointer;

  &.top {
    border-top-right-radius: 100px;
    background-color: ${colors.sky}80;
  }
  &.bottom {
    border-bottom-right-radius: 100px;
    background-color: ${colors.red}80;
  }

  & > svg {
    aspect-ratio: 1/1;
    height: 18px;
  }
`;
