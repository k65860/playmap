import styled from "styled-components";
import Tab from "../../layouts/tab";
import { useEffect, useState } from "react";
import User from "./user";
import Account from "./account";
import Setting from "./setting";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../assets/atoms";
import { useNavigate } from "react-router-dom";
import colors from "../../assets/colors";
import Modal from "../../layouts/modal";
import Button from "../../layouts/button";
import ExchangeRequestModal from "../../components/exchange-request-modal";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

const tabList = [
  { id: 1, name: "회원목록" },
  { id: 2, name: "입출금 내역" },
  { id: 3, name: "설정" },
];

export default () => {
  const nav = useNavigate();
  const user = useRecoilValue(userAtom);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isExchangeRequestModal, setExchangeRequestModal] =
    useState<boolean>(false);

  const onTabClick = (id: number) => {
    setActiveTab(id);
  };

  useEffect(() => {
    if (!user) return;
    if (user?.USR_TP !== 1) nav("/");
  }, [user?.USR_TP]);

  return (
    <>
      <Container>
        <Tab array={tabList} onClick={onTabClick} value={activeTab} />
        <Contents>
          {activeTab === 1 && <User />}
          {activeTab === 2 && <Account />}
          {activeTab === 3 && <Setting />}
        </Contents>
      </Container>

      <ExchangeRequestOpenButton
        backgroundColor="orange"
        icon={<CampaignRoundedIcon />}
        onClick={() => setExchangeRequestModal(true)}
      />

      {isExchangeRequestModal && (
        <Modal
          title="추천인 상품 교환 신청"
          onClose={() => setExchangeRequestModal(false)}
        >
          <ExchangeRequestModal />
        </Modal>
      )}
    </>
  );
};

const Container = styled.main``;
const Contents = styled.div`
  padding: 20px 0;
`;
export const NoneItem = styled.div`
  font-size: 12px;
  color: ${colors.gray};
  text-align: center;
  padding: 10px 0;
`;
const ExchangeRequestOpenButton = styled(Button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;

  svg {
    font-size: 30px;
  }
`;
