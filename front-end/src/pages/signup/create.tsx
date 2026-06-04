import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../../layouts/input";
import { useMutation } from "react-query";
import { alert, http, phoneHyphen } from "../../assets/functions";
import Button from "../../layouts/button";
import FindAddressModal from "../../components/find-address-modal";
import colors from "../../assets/colors";

export default () => {
  const state = useLocation()?.state?.isUser;
  const kakaoInfo = useLocation()?.state?.kakaoInfo;
  const nav = useNavigate();
  const [isAddrModal, setIsAddrModal] = useState<boolean>(false);
  const [duplicateIdCheckCode, setDuplicateIdCheckCode] = useState<number>(0);
  const [input, setInput] = useState<Partial<Common.User>>({
    USR_ID: "",
    USR_PW: "",
    USR_PW_CFM: "",
    USR_TP: 0,
    USR_NM: "",
    USR_NO: "",
    USR_MAIL: "",
    USR_ADDR: "",
    USR_ADDR_DTL: "",
    ADM_JOIN_CD: "",
    USR_CHILD_CNT: 1,
  });

  const { isLoading: duplicateIdCheckLoading, mutate: duplicateIdCheck } =
    useMutation(async () => {
      const form = { USR_ID: input?.USR_ID };
      const { data } = await http.post("/auth/duplicate-id-check", form);
      if (!data?.result) {
        setDuplicateIdCheckCode(2);
        document.querySelector<HTMLInputElement>("#id-input")?.focus();
        return alert.error(data?.message);
      }
      setDuplicateIdCheckCode(1);
      alert.success("사용가능해요.");
    });

  const { isLoading: signupLoading, mutate: signup } = useMutation<
    void,
    void,
    FormEvent<HTMLFormElement>
  >(async (e) => {
    e?.preventDefault();
    const USR_TP = state === "user" ? 2 : state === "admin" ? 1 : 0;

    if (!kakaoInfo) {
      if (duplicateIdCheckCode === 0) {
        return alert.warn("아이디 중복확인을 해주세요.");
      } else if (duplicateIdCheckCode === 2) {
        return alert.warn("다른 아이디를 사용해주세요.");
      }
    }

    if (!input?.USR_ADDR) {
      return alert.warn("주소를 입력해주세요.");
    }

    let body: Partial<Common.User> = {};

    if (kakaoInfo) {
      body = {
        USR_ID: kakaoInfo?.USR_ID,
        USR_PW: kakaoInfo?.USR_PW,
        USR_PW_CFM: kakaoInfo?.USR_PW,
        USR_TP: USR_TP,
        USR_NM: input?.USR_NM,
        USR_NO: phoneHyphen(input?.USR_NO ?? ""),
        USR_MAIL: input?.USR_MAIL,
        USR_ADDR: input?.USR_ADDR,
        USR_ADDR_DTL: input?.USR_ADDR_DTL,
        ADM_JOIN_CD: input?.ADM_JOIN_CD,
        USR_CHILD_CNT: Number(input?.USR_CHILD_CNT),
      };
    } else {
      body = {
        USR_ID: input?.USR_ID,
        USR_PW: input?.USR_PW,
        USR_PW_CFM: input?.USR_PW_CFM,
        USR_TP: USR_TP,
        USR_NM: input?.USR_NM,
        USR_NO: phoneHyphen(input?.USR_NO ?? ""),
        USR_MAIL: input?.USR_MAIL,
        USR_ADDR: input?.USR_ADDR,
        USR_ADDR_DTL: input?.USR_ADDR_DTL,
        ADM_JOIN_CD: input?.ADM_JOIN_CD,
        USR_CHILD_CNT: Number(input?.USR_CHILD_CNT),
      };
    }

    const { data } = await http.post("/auth/signup", body);
    if (!data?.result) return alert.error(data?.message);
    alert.success("가입이 완료되었습니다.");
    nav("/login");
  });

  // ! onChange함수
  const onChange = (key: string, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setInput((prev) => ({ ...prev, USR_ADDR: fullAddress }));
    setIsAddrModal(false);
  };

  return (
    <>
      <Container>
        <Header>{state === "user" ? "회원" : "관리자"} 가입</Header>
        {/* 회원 */}
        {state === "user" ? (
          <Contents onSubmit={(e) => signup(e)}>
            {!kakaoInfo && (
              <>
                <Row>
                  <p>아이디</p>
                  <Box>
                    <Input
                      id="id-input"
                      required={kakaoInfo ? false : true}
                      value={input?.USR_ID ?? ""}
                      placeholder="아이디를 입력해주세요."
                      onChange={(e) => onChange("USR_ID", e)}
                      disabled={duplicateIdCheckCode === 1}
                    />
                    <Button
                      type="button"
                      loading={duplicateIdCheckLoading}
                      onClick={duplicateIdCheck}
                      disabled={duplicateIdCheckCode === 1}
                    >
                      중복확인
                    </Button>
                  </Box>
                </Row>
                <Row>
                  <p>비밀번호</p>
                  <Input
                    full
                    type="password"
                    required={kakaoInfo ? false : true}
                    value={input?.USR_PW ?? ""}
                    placeholder="비밀번호를 입력해주세요."
                    onChange={(e) => onChange("USR_PW", e)}
                  />
                </Row>
                <Row>
                  <p>비밀번호 확인</p>
                  <Input
                    full
                    type="password"
                    required={kakaoInfo ? false : true}
                    value={input?.USR_PW_CFM ?? ""}
                    placeholder="비밀번호를 입력해주세요."
                    onChange={(e) => onChange("USR_PW_CFM", e)}
                  />
                </Row>
              </>
            )}
            <Line />
            <Row>
              <p>연락처</p>
              <Input
                full
                required={true}
                value={phoneHyphen(input?.USR_NO ?? "") ?? ""}
                placeholder="연락처를 입력해주세요."
                onChange={(e) => onChange("USR_NO", e)}
                maxLength={13}
              />
            </Row>
            <Row>
              <p>이메일</p>
              <Input
                full
                type="email"
                required={true}
                value={input?.USR_MAIL ?? ""}
                placeholder="이메일을 입력해주세요."
                onChange={(e) => onChange("USR_MAIL", e)}
              />
            </Row>
            <Row>
              <p>주소</p>
              <Box>
                <Input
                  full
                  disabled
                  flex={true}
                  required={true}
                  value={input?.USR_ADDR ?? ""}
                  placeholder="주소를 입력해주세요."
                  onChange={(e) => onChange("USR_ADDR", e)}
                />
                <Button onClick={() => setIsAddrModal(true)} type="button">
                  주소찾기
                </Button>
              </Box>
            </Row>
            <Row>
              <p>자녀수</p>
              <Input
                type="number"
                width={130}
                required={true}
                value={input?.USR_CHILD_CNT ?? ""}
                placeholder="자녀수를 입력해주세요."
                onChange={(e) => onChange("USR_CHILD_CNT", e)}
                min={1}
              />
            </Row>

            <Bottom>
              <Button
                type="button"
                full
                backgroundColor="gray"
                onClick={() => nav(-1)}
              >
                뒤로가기
              </Button>
              <Button full loading={signupLoading}>
                가입
              </Button>
            </Bottom>
          </Contents>
        ) : (
          <Contents onSubmit={(e) => signup(e)}>
            {/* 관리자 */}
            {!kakaoInfo && (
              <>
                <Row>
                  <p>아이디</p>
                  <Box>
                    <Input
                      full
                      id="id-input"
                      required={kakaoInfo ? false : true}
                      value={input?.USR_ID ?? ""}
                      placeholder="아이디를 입력해주세요."
                      onChange={(e) => onChange("USR_ID", e)}
                      disabled={duplicateIdCheckCode === 1}
                    />
                    <Button
                      type="button"
                      loading={duplicateIdCheckLoading}
                      onClick={duplicateIdCheck}
                      disabled={duplicateIdCheckCode === 1}
                    >
                      중복확인
                    </Button>
                  </Box>
                </Row>
                <Row>
                  <p>비밀번호</p>
                  <Input
                    full
                    type="password"
                    required={kakaoInfo ? false : true}
                    value={input?.USR_PW ?? ""}
                    placeholder="비밀번호를 입력해주세요."
                    onChange={(e) => onChange("USR_PW", e)}
                  />
                </Row>
                <Row>
                  <p>비밀번호 확인</p>
                  <Input
                    full
                    type="password"
                    required={kakaoInfo ? false : true}
                    value={input?.USR_PW_CFM ?? ""}
                    placeholder="비밀번호를 입력해주세요."
                    onChange={(e) => onChange("USR_PW_CFM", e)}
                  />
                </Row>
              </>
            )}
            <Line />
            <Row>
              <p>이름</p>
              <Input
                full
                width={250}
                required={true}
                value={input?.USR_NM ?? ""}
                placeholder="이름을 입력해주세요."
                onChange={(e) => onChange("USR_NM", e)}
              />
            </Row>
            <Row>
              <p>연락처</p>
              <Input
                full
                required={true}
                value={phoneHyphen(input?.USR_NO ?? "") ?? ""}
                placeholder="연락처를 입력해주세요."
                onChange={(e) => onChange("USR_NO", e)}
                maxLength={13}
              />
            </Row>
            <Row>
              <p>이메일</p>
              <Input
                full
                type="email"
                required={true}
                value={input?.USR_MAIL ?? ""}
                placeholder="이메일을 입력해주세요."
                onChange={(e) => onChange("USR_MAIL", e)}
              />
            </Row>
            <Row>
              <p>주소</p>
              <Box>
                <Input
                  full
                  disabled
                  flex={true}
                  required={true}
                  value={input?.USR_ADDR ?? ""}
                  placeholder="주소를 입력해주세요."
                  onChange={(e) => onChange("USR_ADDR", e)}
                />
                <Button onClick={() => setIsAddrModal(true)} type="button">
                  주소찾기
                </Button>
              </Box>
            </Row>
            {state === "admin" && (
              <Row>
                <p>상세주소</p>
                <Input
                  full
                  required={state === "admin" ? true : false}
                  value={input?.USR_ADDR_DTL ?? ""}
                  placeholder="상세주소를 입력해주세요."
                  onChange={(e) => onChange("USR_ADDR_DTL", e)}
                />
              </Row>
            )}
            <Line />
            <Row>
              <p>관리자 코드</p>
              <Input
                full
                width={200}
                required={state === "admin" ? true : false}
                value={input?.ADM_JOIN_CD ?? ""}
                placeholder="6자리 코드"
                onChange={(e) => onChange("ADM_JOIN_CD", e)}
              />
            </Row>

            <Bottom>
              <Button
                type="button"
                full
                backgroundColor="gray"
                onClick={() => nav(-1)}
              >
                뒤로가기
              </Button>
              <Button full loading={signupLoading}>
                가입
              </Button>
            </Bottom>
          </Contents>
        )}

        {isAddrModal && (
          <FindAddressModal
            onClose={() => setIsAddrModal(false)}
            onClick={handleComplete}
            buttons={
              <>
                <Button
                  onClick={() => setIsAddrModal(false)}
                  full
                  backgroundColor="gray"
                >
                  닫기
                </Button>
              </>
            }
          />
        )}
      </Container>
    </>
  );
};

const Container = styled.main``;
const Header = styled.div`
  margin: 20px 0 40px;
  font-size: 22px;
  font-weight: 900;
`;
const Contents = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    &::after {
      content: "필수";
      font-size: 12px;
      color: ${colors.red};
      margin-left: 4px;
    }
    text-indent: 10px;
    font-size: 14px;
    font-weight: 700;

    &.none-require {
      &::after {
        content: "";
      }
    }
  }
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
`;
const Line = styled.div`
  width: 95%;
  height: 1px;
  background-color: ${colors.whiteGray};
  margin: 20px auto;
`;
const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
`;
