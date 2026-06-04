import React, { useState } from "react";
import {
  ActivityCard as StyledCard,
  ActivityTitle,
  EmptyTitle,
  ActivityHeaderRow,
  ButtonGroup,
  ActiveButton,
  InactiveButton,
  Comment,
  NoteContainer,
  NoteText,
  ToggleIcon,
  ContentContainer,
  ContextTitle,
} from "./styles";

import toggleIcon from "../../assets/images/icon/toggle.png";

type ActivityStatus = "활동함" | "활동안함";

interface Activity {
  id: number;
  status: ActivityStatus;
  comment?: string;
  note?: string; // 내용 관련 노트
  feedbackNote?: string; // 피드백 관련 노트
}

interface Props {
  activity?: Activity;
  onStatusChange?: (id: number, newStatus: ActivityStatus) => void;
  onTitleClick?: () => void;
  isEmpty?: boolean;
}

const ActivityCard = ({
  activity,
  onStatusChange,
  onTitleClick,
  isEmpty = false,
}: Props) => {
  if (isEmpty) {
    return (
      <StyledCard>
        <ActivityTitle>
          <EmptyTitle>활동기록 없음</EmptyTitle>
        </ActivityTitle>
      </StyledCard>
    );
  }

  if (!activity || !onStatusChange) return null;

  return (
    <StyledCard>
      <ActivityHeaderRow>
        <ActivityTitle onClick={onTitleClick} style={{ cursor: "pointer" }}>
          놀이활동 기록 제목
        </ActivityTitle>
        <ButtonGroup>
          <ActiveButton onClick={() => onStatusChange(activity.id, "활동함")}>
            활동함
          </ActiveButton>
          <InactiveButton
            onClick={() => onStatusChange(activity.id, "활동안함")}
          >
            활동안함
          </InactiveButton>
        </ButtonGroup>
      </ActivityHeaderRow>

      {activity.comment && (
        <Comment positive={activity.comment === "긍정적"}>
          {activity.comment}
        </Comment>
      )}

      {activity.note && (
        <ContentContainer>
          <ContextTitle>내용</ContextTitle>
          <ExpandableNote note={activity.note} />
        </ContentContainer>
      )}

      {activity.feedbackNote && (
        <ContentContainer>
          <ContextTitle>피드백</ContextTitle>
          <ExpandableNote note={activity.feedbackNote} />
        </ContentContainer>
      )}
    </StyledCard>
  );
};

const ExpandableNote = ({ note }: { note: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <NoteContainer onClick={() => setExpanded(!expanded)}>
      <NoteText expanded={expanded}>{note}</NoteText>
      <ToggleIcon src={toggleIcon} expanded={expanded} alt="toggle" />
    </NoteContainer>
  );
};

export default ActivityCard;
