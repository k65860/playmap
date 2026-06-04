import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userAtom } from "../../assets/atoms";
import { useMutation, useQuery } from "react-query";
import { alert, delay, http } from "../../assets/functions";
import Button from "../../layouts/button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../layouts/modal";
import Input from "../../layouts/input";
import colors from "../../assets/colors";
import Skeleton from "react-loading-skeleton";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

interface Profile {
  PRF_SQ: number;
  PRF_NM: string;
}

const bgColors = [
  "#FCD060",
  "#F9B5B5",
  "#b9e2a2",
  "#f9e3b5",
  "#7FD5D3",
  "#b5d0f9",
  "#d2b5f9",
];

export default () => {
  const nav = useNavigate();
  const user = useRecoilValue(userAtom);

  const [profile, setProfile] = useState<Profile>({
    PRF_SQ: 0,
    PRF_NM: "",
  });

  const [isModifyModal, setIsmodifyModal] = useState<boolean>(false);
  const [, , removeCookie] = useCookies(["PLAYMAP_TOKEN"]);

  const {
    isLoading: profileDataLoading,
    data: profileData = [],
    refetch,
  } = useQuery<Common.Profile[]>(
    [`/profile?USR_SQ=${user?.USR_SQ}`, user?.USR_SQ],
    async () => {
      if (!user?.USR_SQ) return;
      const url = `/profile?USR_SQ=${user.USR_SQ}`;
      const { data } = await http.get(url);
      await delay(1000);
      return data?.body;
    },
    {
      enabled: !!user?.USR_SQ,
    }
  );

  const { isLoading: logoutLoading, mutate: logout } = useMutation(async () => {
    const { data } = await http.get("/auth/logout");
    if (!data?.result) return alert.error(data?.message);
    removeCookie("PLAYMAP_TOKEN");
    alert.success("로그아웃 되었습니다.");
    return data?.body;
  });

  const { mutate: profileClick } = useMutation(async (PRF_SQ: number) => {
    sessionStorage.setItem("PRF_SQ", String(PRF_SQ));
    const { data } = await http.get(`/test?PRF_SQ=${PRF_SQ}`);
    if (!data?.result) return alert.error(data?.message);

    if (data?.body?.length === 0) {
      nav("/test/choice");
    } else {
      nav("/");
    }
  });

  const { isLoading: addProfileLoading, mutate: addProfile } = useMutation(
    async () => {
      const ask = window.confirm("자녀 1명을 추가하시겠어요?");
      if (!ask) return;
      const body = {
        USR_SQ: user?.USR_SQ,
      };
      const { data } = await http.post("/profile", body);
      if (!data?.result) return alert.error(data?.message);
      alert.success("자녀가 추가되었습니다.");
      refetch();
    }
  );

  const { mutate: removeProfile } = useMutation<void, void, number>(
    async (PRF_SQ) => {
      if ((profileData?.length ?? 0) < 2)
        return alert.info("마지막 프로필은 삭제할 수 없습니다.");

      const ask = window.confirm("삭제하시겠어요?");
      if (!ask) return;

      const { data } = await http.delete(`/profile/${PRF_SQ}`);
      if (!data?.result) return alert.error(data?.message);
      alert.success("삭제되었어요");
      refetch();
    }
  );
  const { isLoading: modififyNameLoading, mutate: modififyName } = useMutation<
    void,
    void,
    number
  >(async (PRF_SQ) => {
    const body = {
      PRF_NM: profile?.PRF_NM,
    };
    const { data } = await http.put(`/profile/${PRF_SQ}`, body);
    if (!data?.result) return alert.error(data?.message);
    alert.success("변경되었어요");
    setIsmodifyModal(false);
    refetch();
  });

  useEffect(() => {
    if (user?.USR_TP === 1) nav("/admin");
  }, [user]);

  useEffect(() => {
    if (!isModifyModal) return;

    document.querySelector<HTMLInputElement>("#change-profile-name")?.focus();
  }, [isModifyModal]);
  return (
    <>
      <Container>
        <Contents>
          {profileDataLoading ? (
            <>
              <Skeleton height={47} borderRadius={47}></Skeleton>
              <Skeleton
                style={{ marginBottom: 5, float: "right" }}
                width={100}
              />
              <Skeleton height={47} borderRadius={47}></Skeleton>
              <Skeleton
                style={{ marginBottom: 5, float: "right" }}
                width={100}
              />
              <Skeleton height={47} borderRadius={47}></Skeleton>
              <Skeleton style={{ float: "right" }} width={100} />
            </>
          ) : (
            profileData?.map((item, i) => (
              <Box key={item?.PRF_SQ}>
                <Profile
                  onClick={() => profileClick(item?.PRF_SQ)}
                  color={bgColors[i % bgColors?.length]}
                >
                  <AccountCircleRoundedIcon />
                  {item?.PRF_NM}
                </Profile>
                <Bottom>
                  <Text
                    onClick={() => {
                      setIsmodifyModal(true);
                      setProfile({
                        PRF_SQ: item?.PRF_SQ,
                        PRF_NM: item?.PRF_NM,
                      });
                    }}
                  >
                    이름 변경
                  </Text>
                  <Text onClick={() => removeProfile(item?.PRF_SQ)}>삭제</Text>
                </Bottom>
              </Box>
            ))
          )}
        </Contents>

        <Footer>
          <div>
            <Button loading={addProfileLoading} onClick={addProfile} full>
              자녀추가
            </Button>
          </div>
          <div>
            <Button
              onClick={() => nav("/myInfo")}
              backgroundColor="white"
              borderColor="gray"
              color="gray"
              full
            >
              내정보 수정
            </Button>
            <Button
              loading={logoutLoading}
              backgroundColor="gray"
              onClick={() => logout()}
              full
            >
              로그아웃
            </Button>
          </div>
        </Footer>

        {isModifyModal && (
          <Modal
            onClose={() => {
              setIsmodifyModal(false);
              refetch();
            }}
            title="이름 변경"
            buttons={
              <>
                <Button
                  loading={modififyNameLoading}
                  onClick={() => modififyName(profile?.PRF_SQ)}
                  full
                >
                  변경
                </Button>
                <Button
                  onClick={() => {
                    setIsmodifyModal(false);
                    refetch();
                  }}
                  full
                  backgroundColor="gray"
                >
                  닫기
                </Button>
              </>
            }
          >
            <Div>
              <Input
                full
                id="change-profile-name"
                placeholder="이름을 입력해주세요."
                value={profile?.PRF_NM}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    PRF_NM: e,
                  }))
                }
              />
            </Div>
          </Modal>
        )}
      </Container>
    </>
  );
};
const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 50px;
  gap: 10px;
`;
const Profile = styled.div`
  width: 100%;
  border-radius: 100px;
  display: flex;
  align-items: center;
  padding: 1px;
  background-color: ${(x) => x?.color};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  white-space: break-spaces;

  &:active {
    background-color: ${(x) => x?.color}cc;
  }

  & > svg {
    font-size: 52px;
    color: white;
    margin-right: 5px;
  }
`;
const Box = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`;
const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  align-self: flex-end;
  padding-right: 15px;
  color: ${colors.gray};
`;
const Text = styled.span`
  font-size: 12px;
  cursor: pointer;
  &:active {
    color: #999;
  }
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;

  & > div {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
`;
