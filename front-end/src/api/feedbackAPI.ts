import axios from "axios";

export const postFeedback = async ({
  date,
  keywords,
  content,
}: {
  date: string;
  keywords: string[];
  content: string;
}) => {
  console.log("POST /api/feedback", { date, keywords, content });

  // 실제로는 아래 요청이 전송되지만, 현재는 mocking 상태
  return axios.post("/api/feedback", {
    date,
    keywords,
    content,
  });
};
