import React from "react";
import styled from "styled-components";

interface Props {
  type: "date" | "time";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default ({ type, value, onChange }: Props) => {
  return <StyledInput type={type} value={value} onChange={onChange} />;
};

const StyledInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 35px;
  font-size: 12px;
`;
