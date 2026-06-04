import styled from "styled-components";
import colors from "../assets/colors";

interface Props {
  total: number;
  current: number;
}

export default (props: Props) => {
  const { total, current } = props;

  // 진행률 계산
  const progressPercentage =
    total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <Container>
      <ProgressText>
        전체 진행 현황: {total} 항목 중 {current} 항목 완료 (
        {Math.round(progressPercentage)}%)
      </ProgressText>

      <ProgressBar>
        <ProgressFill progress={progressPercentage} />
      </ProgressBar>
    </Container>
  );
};

// 컨테이너 스타일
const Container = styled.div`
  width: 100%;
  margin: 8px 0;
`;

// 진행률 텍스트 스타일
const ProgressText = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

// 진행 바 스타일
const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

// 진행된 부분 스타일
const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  transition: width 0.3s ease-in-out;
  border-radius: 100px;
  background: linear-gradient(to right, ${colors.yellow}, ${colors.green});
`;
