import styled from "styled-components";
import colors from "../../assets/colors";

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

// 캘린더 스타일
export const CalendarWrapper = styled.div`
  .react-calendar {
    border: none;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
  }

  // 캘린더 헤더 : 2025년 4월
  .react-calendar__navigation__label {
    font-size: 16px;
    font-weight: bold;
  }

  // 요일일
  .react-calendar__month-view__weekdays {
    border-bottom: 1px solid #d9d9d9;
  }

  // 날짜 셀 스타일
  .react-calendar__tile {
    display: flex;
    flex-direction: column; /* 세로 정렬: 날짜 숫자 + 점 아래로 */
    align-items: center;
    justify-content: flex-start;
    padding: 6px 0;
    height: 60px; /* 날짜 셀 높이 고정 */
    box-sizing: border-box;
    border-bottom: 1px solid #d9d9d9;
  }

  // 선택된 날짜
  .react-calendar__tile--active {
    color: black;
  }

  // 오늘 날짜
  .react-calendar__tile--now {
    background: #d9d9d9;
    color: black;
  }
`;

export const Container = styled.div``;

export const CalendarPlaceholder = styled.p`
  color: #888;
`;

export const ActivityList = styled.div`
  padding: 20px;
`;

export const ActivityHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

// 활동 기록 박스 리스트
export const ActivityCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const ActivityTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
`;

export const EmptyTitle = styled.div`
  color: grey;
  font-weight: bold;
`;

export const ActivityDot = styled.div`
  margin-top: 4px;
  font-size: 8px;
  color: red;
  line-height: 1;
`;

export const ActiveButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #4e99e2;
  color: #ffffff;
  border: none;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const InactiveButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #d9d9d9;
  color: #ffffff;
  border: none;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

// 긍정적
export const Comment = styled.p<{ positive?: boolean }>`
  color: ${({ positive }) =>
    positive ? "green" : "#999"}; // 상태가 positive일때 green -> 추후 수정 필요
  font-size: 14px;
  margin: 5px 0;
`;

// 놀이활동에 대한 내용
export const Note = styled.p`
  font-size: 14px;
  color: black;
  margin: 5px 0;
`;

export const PlusButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
`;

export const NoteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
`;

export const NoteText = styled.div<{ expanded: boolean }>`
  flex: 1;
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${({ expanded }) => (expanded ? "none" : 1)};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  padding: 10px 16px 0 0;
`;

export const ToggleIcon = styled.img<{ expanded: boolean }>`
  width: 16px;
  height: 16px;
  margin-left: 8px;
  transform: rotate(${({ expanded }) => (expanded ? "180deg" : "0deg")});
  transition: transform 0.2s ease-in-out;
  flex-shrink: 0;
`;

export const ContextTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

export const ContentContainer = styled.div`
  margin: 0; //추후 여백 수정 필요
`;
