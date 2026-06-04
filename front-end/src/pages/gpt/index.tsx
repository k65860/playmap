import styled from "styled-components";
import Title from "../../components/title";
import { useEffect, useMemo, useRef, useState } from "react";
import AskModal from "./ask-modal";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../layouts/button";
import { useQuery } from "react-query";
import { c, http } from "../../assets/functions";
import colors from "../../assets/colors";
import Face6RoundedIcon from "@mui/icons-material/Face6Rounded";
import gptImage from "../../assets/images/icon/playmap-icon.png";
import Skeleton from "react-loading-skeleton";
import { NoneItem } from "../admin";

export default () => {
  const nav = useNavigate();
  const result = useLocation()?.state as Test.HistoryDetail;
  const CHAT_LIST_REF = useRef<HTMLUListElement>(null);
  const [isAskModal, setIsAskModal] = useState<boolean>(false);

  const PRF_SQ = useMemo(() => {
    return Number(sessionStorage.getItem("PRF_SQ") ?? 0);
  }, [sessionStorage.getItem("PRF_SQ")]);

  const { isLoading: getChatLoading, data: chats = [] } = useQuery<Gpt[]>(
    ["/gpt?PRF_SQ=" + PRF_SQ],
    async () => {
      const { data } = await http.get("/gpt?PRF_SQ=" + PRF_SQ);
      setTimeout(() => {
        if (!CHAT_LIST_REF.current) return;
        CHAT_LIST_REF.current.scrollTo(0, CHAT_LIST_REF.current.scrollHeight);
      }, 100);
      return data?.body ?? [];
    },
    { enabled: !!PRF_SQ }
  );

  useEffect(() => {
    if (!result) nav(-1);
  }, []);

  return (
    <Container>
      <Title title="플레이맵 AI 솔루션" />
      <ChatList ref={CHAT_LIST_REF}>
        {getChatLoading ? (
          <>
            <ChatItem className="right">
              <Skeleton width={300} height={100} borderRadius={10} />
            </ChatItem>
            <ChatItem className="left">
              <Skeleton width={300} height={140} borderRadius={10} />
            </ChatItem>
            <ChatItem className="right">
              <Skeleton width={300} height={60} borderRadius={10} />
            </ChatItem>
            <ChatItem className="left">
              <Skeleton width={300} height={100} borderRadius={10} />
            </ChatItem>
          </>
        ) : !chats?.length ? (
          <NoneItem style={{ padding: "100px 0" }}>채팅이 없습니다.</NoneItem>
        ) : (
          chats?.map((item) => (
            <ChatItem
              key={item?.GPT_SQ}
              className={c({
                right: item?.GPT_TP === 1,
                left: item?.GPT_TP === 2,
              })}
            >
              {item?.GPT_TP === 1 ? (
                <Face6RoundedIcon
                  style={{ color: colors.main + "aa", fontSize: 30 }}
                />
              ) : (
                <Image src={gptImage} />
              )}
              <ChatItemContents>{item?.GPT_CN}</ChatItemContents>
              <ChatItemInfo>{item?.CRT_DT}</ChatItemInfo>
            </ChatItem>
          ))
        )}
      </ChatList>
      <Bottom>
        <Button full onClick={() => setIsAskModal(true)}>
          질문하기
        </Button>
      </Bottom>

      {isAskModal && (
        <AskModal {...{ result, onClose: () => setIsAskModal(false) }} />
      )}
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
const ChatList = styled.ul`
  flex: 1;
  overflow: auto;
`;
const ChatItem = styled.li`
  display: flex;
  align-items: flex-end;
  padding: 10px 20px;
  margin-bottom: 10px;
  gap: 6px;

  &.left {
    flex-direction: row;

    .info {
      text-align: left;
    }
  }
  &.right {
    flex-direction: row-reverse;

    .info {
      text-align: right;
    }
  }

  &:last-of-type {
    margin-bottom: 100px;
  }
`;
const ChatItemContents = styled.div.attrs({
  className: "contents",
})`
  border: 1px solid ${colors.whiteGray};
  border-radius: 10px;
  padding: 15px;
  font-size: 14px;
  line-height: 22px;
  width: auto;
  max-width: 80%;
  white-space: break-spaces;
`;
const ChatItemInfo = styled.div.attrs({
  className: "info",
})`
  font-size: 10px;
  color: ${colors.whiteGray};
  margin-bottom: 4px;
  min-width: 64px;
`;
const Bottom = styled.div`
  padding: 0 20px 20px;
`;
const Image = styled.img`
  width: 26px;
  height: 26px;
  object-fit: contain;
`;
