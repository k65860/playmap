import styled from "styled-components";
import Title from "../../components/title";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../layouts/button";
import { useQuery } from "react-query";
import { http } from "../../assets/functions";
import Skeleton from "react-loading-skeleton";
import { NoneItem } from "../admin";
import colors from "../../assets/colors";

export const descriptionText = `🎧 우리 아이의 최적 컨디션을 위한 맞춤형 AI 음악 🎧

우리 아이가 학습과 운동에 집중하기 어렵거나, 스트레스로 긴장된 상태인가요?
신경과학, 심리학, 음악치료 연구를 기반으로 설계된 맞춤형 AI 음악이 주의력 강화, 감정 안정, 창의력 향상을 돕습니다

🧠 과학적 연구 기반 맞춤 음악
✔ 뇌파 연구 – 감정 상태별 뇌파 변화를 분석, 최적의 감정 조절 유도
✔ 심박수와 음악 – 저주파와 고주파가 심박 변화율에 미치는 영향 분석, 긴장 완화 및 집중력 향상
✔ 음악의 감정 구조 분석 – 음높이, 템포, 리듬을 활용해 감정을 조절하는 맞춤형 음악 설계
✔ 음악치료 연구 – ADHD, 정서 장애, 지적 장애 아동 대상 연구를 기반으로 주의력, 감정 조절, 인지 발달 효과 적용

🎯 맞춤형 음악이 각성을 조절하는 방법
✅ 낮은 각성을 높이고 싶다면?
- 활력을 불어넣고 집중력을 높이는 음악 🎵
- 베타파(β), 감마파(γ) 활성화로 학습 및 운동 능력 향상

✅ 높은 각성을 낮추고 싶다면?
- 긴장을 풀고 심신을 안정시키는 음악 🎶
- 알파파(α), 세타파(θ) 유도로 편안한 컨디션 유지

🎵 우리 아이를 위한 과학적 맞춤형 AI 음악으로 최상의 집중력과 에너지를 경험하세요!`;

export default () => {
  const nav = useNavigate();
  const result = useLocation()?.state as Test.HistoryDetail;
  const AUDIO_REF = useRef<HTMLAudioElement>(null);
  const CANVAS_REF = useRef<HTMLCanvasElement>(null);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [activeMusic, setActiveMusic] = useState<Music>();

  const CHAR_SQ_LIST = useMemo<number[]>(() => {
    return result?.CHARACTER?.map((x) => x?.CHAR_SQ);
  }, [result]);

  const { isLoading: musicLoading, data: musics = [] } = useQuery<Music[]>(
    ["/music"],
    async () => {
      let url = "/music?CHAR_SQ=" + CHAR_SQ_LIST?.[0];

      for (let i = 1; i < CHAR_SQ_LIST?.length; i++) {
        url += `&CHAR_SQ=${CHAR_SQ_LIST?.[i]}`;
      }

      const { data } = await http.get(url);
      return data?.body?.MUSIC ?? [];
    },
    { enabled: !!CHAR_SQ_LIST?.length }
  );

  useEffect(() => {
    if (!AUDIO_REF.current) return;

    if (activeMusic) {
      AUDIO_REF.current?.play();
    } else {
      AUDIO_REF.current?.pause();
    }
  }, [activeMusic]);

  useEffect(() => {
    if (!result) {
      nav(-1);
      return;
    }

    const onPlay = () => {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      drawWaveform();
    };

    const audio = AUDIO_REF.current;
    const canvas = CANVAS_REF.current;
    const ctx = canvas?.getContext?.("2d");
    if (!audio || !canvas || !ctx) return;

    // 오디오 컨텍스트 설정
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512; // FFT 크기 조절
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvas.height = 200;

    function drawWaveform() {
      if (!audio || !canvas || !ctx) return;

      requestAnimationFrame(drawWaveform);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2; // 중앙 기준
      const barWidth = 10; // 막대 두께
      const barSpacing = 8; // 막대 간격
      const totalBars = Math.floor(canvas.width / (barWidth + barSpacing)) + 2; // 최대 막대 수

      let x = 0;
      for (let i = 0; i < totalBars; i++) {
        const v = dataArray[i] / 255; // 0~255 값을 0~1 범위로 정규화
        const barHeight = v * canvas.height * 0.6; // 세로 길이 조절

        // 🔥 그라데이션 적용
        const gradient = ctx.createLinearGradient(
          x,
          centerY - barHeight / 2,
          x,
          centerY + barHeight / 2
        );
        gradient.addColorStop(0, "#E765C2"); // 하단 색상
        gradient.addColorStop(1, "#F6AB6A"); // 하단 색상
        ctx.fillStyle = gradient;

        // 둥근 막대 (위쪽)
        ctx.beginPath();
        ctx.arc(
          x + barWidth / 2,
          centerY - barHeight / 2,
          barWidth / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 둥근 막대 (아래쪽)
        ctx.beginPath();
        ctx.arc(
          x + barWidth / 2,
          centerY + barHeight / 2,
          barWidth / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 중앙 기준 위아래로 확장
        ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);

        x += barWidth + barSpacing;
      }
    }

    AUDIO_REF.current?.addEventListener("play", onPlay);

    return () => {
      AUDIO_REF.current?.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <Container>
      <Title title="AI 음원듣기" />
      <audio
        ref={AUDIO_REF}
        src={activeMusic?.MSC_PATH}
        onPlay={() => setPlay(true)}
        onPause={() => setPlay(false)}
        onError={() => {}}
      />
      <CanvasContainer>
        <Canvas ref={CANVAS_REF} isPlay={isPlay} />
        {!isPlay && <Desc>음원을 재생해주세요.</Desc>}
      </CanvasContainer>

      <MusicList>
        {musicLoading ? (
          <>
            <Skeleton
              width={"100%"}
              height={36}
              borderRadius={100}
              style={{ marginBottom: 10 }}
            />
            <Skeleton
              width={"100%"}
              height={36}
              borderRadius={100}
              style={{ marginBottom: 10 }}
            />
          </>
        ) : !musics?.length ? (
          <NoneItem style={{ padding: "100px 0" }}>음원이 없습니다.</NoneItem>
        ) : (
          musics?.map((item) => (
            <Button
              key={item?.MSC_SQ}
              full
              style={{ marginBottom: 10 }}
              backgroundColor={
                activeMusic?.MSC_SQ === item?.MSC_SQ ? "orange" : "main"
              }
              onClick={() => {
                setActiveMusic(
                  activeMusic?.MSC_SQ === item?.MSC_SQ ? undefined : item
                );
              }}
            >
              [{item?.CHAR_NM}] {item?.MSC_NM} 재생
            </Button>
          ))
        )}
      </MusicList>

      <Description>{descriptionText}</Description>
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  gap: 20px;
`;
const MusicList = styled.ul`
  padding: 0 10px;
`;
const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const Canvas = styled.canvas<{ isPlay: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 200px;
  border: 5px solid ${(x) => (x?.isPlay ? colors.green : colors.whiteGray)};
  background-color: ${colors.black};
  margin: 20px 0;
`;
const Desc = styled.div`
  position: absolute;
  font-size: 12px;
  color: ${colors.white};
  bottom: 60%;
`;
const Description = styled.div`
  font-size: 14px;
  color: ${colors.black};
  line-height: 20px;
  padding: 0 20px 20px;
  white-space: break-spaces;
  word-break: auto-phrase;
`;
