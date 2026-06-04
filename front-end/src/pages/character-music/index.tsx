import { useQuery } from "react-query";
import { delay, http } from "../../assets/functions";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Title from "../../components/title";
import { useEffect, useRef, useState } from "react";
import colors from "../../assets/colors";
import { NoneItem } from "../admin";
import Button from "../../layouts/button";
import Skeleton from "react-loading-skeleton";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";

export default () => {
  const params = useParams();
  const CHAR_SQ = params?.CHAR_SQ;
  const AUDIO_REF = useRef<HTMLAudioElement>(null);
  const CANVAS_REF = useRef<HTMLCanvasElement>(null);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [activeMusic, setActiveMusic] = useState<Music>();

  const { isLoading, data } = useQuery<{
    CHARACTER: Common.Character;
    MUSIC: Music[];
  }>(
    ["/music?CHAR_SQ=" + CHAR_SQ],
    async () => {
      const { data } = await http.get("/music?CHAR_SQ=" + CHAR_SQ);
      const result = {
        ...data?.body,
        CHARACTER: data?.body?.CHARACTER?.[0] ?? null,
      };
      return result;
    },
    { enabled: !!CHAR_SQ }
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

    canvas.width = 250;
    canvas.height = 200;

    function drawWaveform() {
      if (!audio || !canvas || !ctx) return;

      requestAnimationFrame(drawWaveform);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2; // 중앙 기준
      const barWidth = 10; // 막대 두께
      const barSpacing = 8; // 막대 간격
      const totalBars = Math.floor(canvas.width / (barWidth + barSpacing)) + 2; // 최대 막대 수

      let x = 0;
      for (let i = 0; i < totalBars; i++) {
        const v = dataArray[i] / 255; // 0~255 값을 0~1 범위로 정규화
        const barHeight = v * canvas.height * 0.7; // 세로 길이 조절

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
      {isLoading ? (
        <Skeleton
          width={160}
          height={30}
          borderRadius={6}
          style={{ margin: "30px 20px 0" }}
        />
      ) : (
        <Title title={(data?.CHARACTER?.CHAR_NM || "캐릭터") + " 음원듣기"} />
      )}
      <audio
        ref={AUDIO_REF}
        src={activeMusic?.MSC_PATH}
        onPlay={() => setPlay(true)}
        onPause={() => setPlay(false)}
        onError={() => {}}
      />
      <Contents>
        <Canvas ref={CANVAS_REF} isPlay={isPlay} />
        {!isPlay && (
          <Desc>
            {isLoading ? (
              <Skeleton width={100} height={18} borderRadius={6} />
            ) : (
              "음원을 재생해주세요."
            )}
          </Desc>
        )}
        {isLoading ? (
          <Skeleton
            width={"70vw"}
            height={"70vw"}
            borderRadius={1000}
            style={{
              aspectRatio: "1/1",
              maxWidth: 500,
              maxHeight: 500,
              marginBottom: 50,
            }}
          />
        ) : (
          <Image img={data?.CHARACTER?.CHAR_IMG_PATH} />
        )}
      </Contents>

      <MusicList>
        {isLoading ? (
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
        ) : !data?.MUSIC?.length ? (
          <NoneItem style={{ padding: "100px 0" }}>음원이 없습니다.</NoneItem>
        ) : (
          data?.MUSIC?.map((item) => (
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
              {activeMusic?.MSC_SQ == item?.MSC_SQ && isPlay ? (
                <PauseCircleRoundedIcon />
              ) : (
                <PlayCircleRoundedIcon />
              )}{" "}
              {item?.MSC_NM}
            </Button>
          ))
        )}
      </MusicList>
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
type ImageProps = { img?: string };
const Image = styled.div<ImageProps>`
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(${(x) => x?.img});
  aspect-ratio: 1/1;
  margin: 0 auto 20px;
  width: calc(100% - 40px);
  max-width: 500px;
`;
const Contents = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;
const Canvas = styled.canvas<{ isPlay: boolean }>`
  width: 250px;
  height: 150px;
  margin: 20px auto 0;
`;
const Desc = styled.div`
  position: absolute;
  font-size: 12px;
  color: ${colors.whiteGray};
  top: 80px;
  user-select: none;
`;
const MusicList = styled.ul`
  padding: 0 10px;
`;
