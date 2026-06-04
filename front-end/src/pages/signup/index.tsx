import { useMemo, useState } from "react";
import Button from "../../layouts/button";
import Checkbox from "../../layouts/checkbox";
import { alert } from "../../assets/functions";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { settingAtom } from "../../assets/atoms";
import { Bottom, Box, Container, Desc } from "./styles";
import Title from "../../components/title";

export default () => {
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const nav = useNavigate();
  const setting = useRecoilValue(settingAtom);
  const kakaoInfo = useLocation()?.state?.kakaoInfo;

  const next = () => {
    if (!agree1 || !agree2 || !agree3) {
      return alert.warn("모든 약관의 동의가 필요합니다.");
    }

    if (kakaoInfo) {
      nav("/signup/choice", { state: { kakaoInfo } });
    } else {
      nav("/signup/choice");
    }
  };

  const text = useMemo(() => {
    return setting?.find((x) => x?.SET_GRP === "JOIN_TERMS")?.SET_VAL ?? "";
  }, [setting]);

  return (
    <>
      <Title title="약관" />
      <Container>
        <Desc>{text}</Desc>
        <div>
          <Box>
            <Checkbox
              value={agree1 && agree2 && agree3}
              onChange={() => {
                const val = !(agree1 && agree2 && agree3);
                setAgree1(val);
                setAgree2(val);
                setAgree3(val);
              }}
            />
            <p>이용약관 전체동의</p>
          </Box>
          <Box>
            <Checkbox
              value={agree1}
              onChange={() => setAgree1((val) => !val)}
            />
            <p>서비스 이용약관</p>
          </Box>
          <Box>
            <Checkbox
              value={agree2}
              onChange={() => setAgree2((val) => !val)}
            />
            <p>개인정보 수집 및 이용 동의</p>
          </Box>
          <Box>
            <Checkbox
              value={agree3}
              onChange={() => setAgree3((val) => !val)}
            />
            <p>개인정보 제3자 제공 동의</p>
          </Box>
        </div>
        <Bottom>
          <Button backgroundColor="gray" onClick={() => nav(-1)} full>
            뒤로가기
          </Button>
          <Button onClick={next} full>
            다음
          </Button>
        </Bottom>
      </Container>
    </>
  );
};
