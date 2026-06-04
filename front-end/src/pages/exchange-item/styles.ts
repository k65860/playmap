import styled from "styled-components";
import colors from "../../assets/colors";

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 53px);
  gap: 20px;
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
export const ItemList = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;
export const Item = styled.div`
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px ${colors.dim};
  background-color: ${colors.main}20;
  border: 3px solid ${colors.main}20;
`;
export const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.black};
  margin-bottom: 10px;
`;
export const ItemSubTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.black};
  margin-bottom: 10px;
`;
export const ItemContent = styled.div`
  font-size: 12px;
  color: ${colors.gray};
  margin-bottom: 20px;
`;
export const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
