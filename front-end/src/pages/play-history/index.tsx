import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HeaderWithActions from "../../components/HeaderWithActions";
import ActivityCard from "./ActivityCard";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/images/icon/plus.png";
import FeedbackModal from "./FeedbackModal";
import Keyword from "./Keyword"; // ✅ Keyword 컴포넌트 추가

import {
  Container,
  CalendarHeader,
  CalendarWrapper,
  ActivityList,
  ActivityDot,
  PlusButton,
  ButtonContainer,
} from "./styles";

type ActivityStatus = "활동함" | "활동안함";

interface Activity {
  id: number;
  status: ActivityStatus;
  comment?: string;
  note?: string;
  feedbackNote?: string;
}

type ActivityMap = Record<string, Activity[]>;

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default () => {
  const [activities, setActivities] = useState<ActivityMap>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  // ✅ 새로 추가한 키워드 선택 값 저장용
  const [who, setWho] = useState<string | null>(null);
  const [where, setWhere] = useState<string | null>(null);

  const handleStatusChange = (id: number, newStatus: ActivityStatus) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    const updated = (activities[dateKey] || []).map((act) =>
      act.id === id ? { ...act, status: newStatus } : act
    );
    setActivities((prev) => ({ ...prev, [dateKey]: updated }));
  };

  const handleTitleClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleSaveFeedback = (
    date: string,
    feedback: string,
    keywords: string[]
  ) => {
    const newActivity: Activity = {
      id: Date.now(),
      status: "활동함",
      note: "집안 곳곳에 작은 보물을 숨겨두고 찾아다니는 놀이", // TODO: 추후 play-data.json 연동
      feedbackNote: feedback,
      comment: keywords.includes("긍정") ? "긍정적" : undefined,
    };

    setActivities((prev) => {
      const updated = { ...prev };
      if (!updated[date]) updated[date] = [];
      updated[date].push(newActivity);
      return updated;
    });
  };

  const handleStepComplete = (selectedWho: string, selectedWhere: string) => {
    setWho(selectedWho);
    setWhere(selectedWhere);

    // 키워드 선택 후 모달 자동 열기
    setSelectedActivity({
      id: -1,
      status: "활동함",
      comment: `${selectedWho}, ${selectedWhere}`,
    });
    setShowModal(true);
  };

  const selectedKey = selectedDate ? formatDate(selectedDate) : null;
  const todaysActivities = selectedKey ? activities[selectedKey] || [] : [];

  return (
    <Container>
      <HeaderWithActions title="활동 기록 하기" />

      {/* ✅ 키워드 선택 UI */}
      {/* <Keyword onStepComplete={handleStepComplete} /> */}

      {/* + 버튼 */}
      <ButtonContainer>
        <PlusButton
          onClick={() => {
            setSelectedActivity({
              id: -1,
              status: "활동함",
            });
            setShowModal(true);
          }}
        >
          <img src={plusIcon} alt="plus" />
        </PlusButton>
      </ButtonContainer>

      {/* 모달 */}
      {showModal && selectedActivity && (
        <FeedbackModal
          activity={selectedActivity}
          onClose={() => {
            setShowModal(false);
            setSelectedActivity(null);
          }}
          onSave={handleSaveFeedback}
        />
      )}

      {/* 달력 */}
      <CalendarHeader>
        <CalendarWrapper>
          <Calendar
            locale="ko-KR"
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate || new Date()}
            calendarType="gregory"
            formatDay={(_, date) => String(date.getDate())}
            tileContent={({ date }) => {
              const key = formatDate(date);
              return activities[key]?.length > 0 ? (
                <ActivityDot>●</ActivityDot>
              ) : null;
            }}
          />
        </CalendarWrapper>
      </CalendarHeader>

      {/* 활동 목록 */}
      {selectedDate && (
        <ActivityList>
          {todaysActivities.length > 0 ? (
            todaysActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStatusChange={handleStatusChange}
                onTitleClick={() => handleTitleClick(activity)}
              />
            ))
          ) : (
            <ActivityCard isEmpty />
          )}
        </ActivityList>
      )}
    </Container>
  );
};
