import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../layouts/button";
import colors from "../../assets/colors";
import DateTimeInput from "./DayTimeInput";
import Keyword from "./Keyword";
import { postFeedback } from "../../api/feedbackAPI";
import playData from "../../../public/play_data.json";

type ActivityStatus = "활동함" | "활동안함";

interface Activity {
  id: number;
  status: ActivityStatus;
  comment?: string;
  note?: string;
}

interface FeedbackModalProps {
  onClose: () => void;
  onSave: (date: string, feedback: string, keywords: string[]) => void;
  activity: Activity;
}

const FeedbackModal = ({ onClose, onSave, activity }: FeedbackModalProps) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleSave = async () => {
    if (!selectedDate || selectedKeywords.length < 2 || !feedbackText.trim()) {
      setError("날짜, 키워드(2개 이상), 놀이활동 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await postFeedback({
        date: selectedDate,
        keywords: selectedKeywords,
        content: feedbackText.trim(),
      });
      onSave(selectedDate, feedbackText.trim(), selectedKeywords);
      alert("저장되었습니다!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Overlay onClick={onClose}>
      <BottomSheet onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>놀이활동 기록 제목</Title>
        </Header>

        <ScrollArea>
          <DateTimeRow>
            <DateTimeInput
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <ResetButton
              onClick={() => {
                setSelectedDate("");
                setSelectedTime("");
              }}
            >
              초기화
            </ResetButton>
          </DateTimeRow>

          {(selectedDate || selectedTime) && (
            <DateBox>
              {selectedDate} {selectedTime}
            </DateBox>
          )}

          {/* ✅ 키워드 선택 영역 */}
          <SectionTitle>🔍 놀이 조건 선택</SectionTitle>
          <Keyword
            onStepComplete={(who, where) => {
              setSelectedKeywords([who, where]);
            }}
          />
          {selectedKeywords.length > 0 && (
            <SelectedBox>
              선택한 키워드: {selectedKeywords.join(", ")}
            </SelectedBox>
          )}

          <SectionTitle>🎯 추천 활동</SectionTitle>
          <ActivityList>
            <ActivityItem>
              <ActivityTitle>📌 집안 보물 찾기</ActivityTitle>
              <ActivityDesc>
                집안 곳곳에 작은 보물을 숨겨두고 찾아다니는 놀이
              </ActivityDesc>
            </ActivityItem>
          </ActivityList>

          <DummyContent>📝 놀이에 관해 간단히 기록해보세요</DummyContent>
          <ExContent>
            예: 물감으로 감정을 표현했어요. 아이가 집중하며 즐거워했어요!
          </ExContent>
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={`놀이활동 기록 (줄 3~5줄, 최대 200자)\n(선택 입력)`}
          />

          {error && <ErrorText>{error}</ErrorText>}
        </ScrollArea>

        <ButtonRow>
          <Button type="submit" onClick={handleSave}>
            저장
          </Button>
          <Button backgroundColor="gray" onClick={onClose}>
            닫기
          </Button>
        </ButtonRow>
      </BottomSheet>
    </Overlay>
  );
};

export default FeedbackModal;

// ✅ 스타일 정의
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const BottomSheet = styled.div`
  width: 100%;
  height: 60%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 24px 24px 12px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
`;

const DateTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
`;

const ResetButton = styled.button`
  background-color: ${colors.gray};
  color: white;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  height: 35px;
  font-size: 12px;
`;

const DateBox = styled.div`
  background-color: #ddd;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  display: inline-block;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin: 24px 0 12px;
  color: #333;
`;

const SelectedBox = styled.div`
  font-size: 13px;
  color: #666;
  margin-top: 8px;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
`;

const ActivityItem = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px 16px;
`;

const ActivityTitle = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

const ActivityDesc = styled.div`
  font-size: 13px;
  color: #555;
  line-height: 1.4;
`;

const DummyContent = styled.div`
  margin-bottom: 6px;
  font-size: 14px;
`;

const ExContent = styled.div`
  font-size: 12px;
  color: grey;
  font-weight: 100;
  margin-bottom: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 12px;
  resize: none;
  margin-bottom: 20px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 13px;
  margin-bottom: 12px;
`;

const ButtonRow = styled.div`
  padding: 24px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #eee;

  & > button {
    width: 100%;
  }
`;
