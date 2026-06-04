import React from "react";
import styled from "styled-components";
import Button from "../layouts/button";
import Title from "../components/title";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { alert, http } from "../assets/functions";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  testHistoryListAtom,
} from "../assets/atoms";
import colors from "../assets/colors";
interface Props {
  title: string;
}

export default ({ title }: Props) => {
  const nav = useNavigate();
  const location = useLocation();
  const testHistory = useRecoilValue(testHistoryListAtom);
  const BGM_AUDIO_REF = useRef<HTMLAudioElement>(null);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [bgmPath, setBgmPath] = useState<string>("");

  // ! 마지막 TEST_SQ
  const lastTestSq = useMemo(() => {
    return testHistory?.[0]?.TEST_SQ;
  }, [testHistory]);

  // ! 적용할 TEST_SQ
  const targetTestSq: number = useMemo(() => {
    const query = location?.state?.TEST_SQ;
    return query ? query : lastTestSq;
  }, [lastTestSq, location?.state?.TEST_SQ]);

  // resultLoading 관련 함수
  const {
    data: result = null,
    isLoading: resultLoading,
    refetch,
  } = useQuery<Test.HistoryDetail>(
    [`/test/${targetTestSq}`],
    async () => {
      if (!targetTestSq) return null;
      const { data } = await http.get(`/test/${targetTestSq}`);
      if (!data?.result) return alert.error(data?.message);
      return data?.body ?? null;
    },
    { enabled: !!targetTestSq }
  );

  // bgm 관련 함수수
  const stopBgm = () => {
    if (!BGM_AUDIO_REF.current) return;
    BGM_AUDIO_REF.current?.pause();
  };

  const playBgm = () => {
    stopBgm();

    if (!BGM_AUDIO_REF.current) return;
    BGM_AUDIO_REF.current?.play();
  };

  useEffect(() => {
    if (!BGM_AUDIO_REF.current) return;
    BGM_AUDIO_REF.current.volume = 0.5;

    if (bgmPath) {
      BGM_AUDIO_REF.current?.play();
    } else {
      BGM_AUDIO_REF.current?.pause();
    }
  }, [bgmPath]);

  return (
    <>
      <audio
        ref={BGM_AUDIO_REF}
        src={bgmPath}
        onPlay={() => setPlay(true)}
        onPause={() => setPlay(false)}
        onError={() => { }}
      />
      <Title
        title={title}
        right={
          <Row>
            <Button
              loading={resultLoading}
              onClick={isPlay ? stopBgm : playBgm}
              backgroundColor={
                resultLoading ? "gray" : isPlay ? "red" : "green"
              }
            >
              BGM {isPlay ? "OFF" : "ON"}
            </Button>
            <IconTouchable onClick={() => nav("/myInfo")}>
              <AccountCircleRoundedIcon />
            </IconTouchable>
          </Row>
        }
      />
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    font-size: 40px;
    color: #4E99E2;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  button {
    flex: 1;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconTouchable = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  & > svg {
    font-size: 40px;
    color: ${colors.main};
  }
`;