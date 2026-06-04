import styled from "styled-components";
import colors from "../../assets/colors";

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 62px);
  gap: 20px;
`;
export const Desc = styled.div`
  height: 100%;
  overflow: auto;
  border: 1px solid #ddd;
  padding: 15px;
  white-space: pre-line;
  font-size: 14px;
  color: ${colors.black};
  border-radius: 5px;
`;
export const Box = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin: 14px 10px;
  font-size: 14px;
`;
export const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
