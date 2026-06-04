import styled from "styled-components";
import colors from "../../assets/colors";

export const Container = styled.main`
  display: flex;
  flex-direction: column;
`;
export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 15px;
`;
export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

  & > div {
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;

    & > p {
      font-size: 14px;
      color: #000;
      white-space: nowrap;
    }
    & > span {
      font-size: 14px;
      color: #999;
      display: block;
    }
  }
`;
export const SubText = styled.div`
  font-size: 14px;
  color: #999;
  height: 100% !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const Desc = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.red};
`;
export const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
`;
export const DeleteAccountText = styled.div`
  white-space: pre-line;
  font-size: 14px;
`;
export const JoinOutBtn = styled.small`
  text-decoration: underline;
  color: ${colors.gray};
  align-self: flex-start;
  cursor: pointer;
`;
