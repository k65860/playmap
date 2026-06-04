import { useQuery } from "react-query";
import { alert, http } from "../assets/functions";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  getCouponListAtom,
  settingAtom,
  testHistoryListAtom,
  testTypeAtom,
  userAtom,
} from "../assets/atoms";
import { useMemo } from "react";

export default () => {
  const user = useRecoilValue(userAtom);
  const setSetting = useSetRecoilState(settingAtom);
  const setTestType = useSetRecoilState(testTypeAtom);
  const setTestHistoryList = useSetRecoilState(testHistoryListAtom);
  const setGetCouponList = useSetRecoilState(getCouponListAtom);

  const PRF_SQ = useMemo(() => {
    return Number(sessionStorage.getItem("PRF_SQ") ?? 0);
  }, [sessionStorage.getItem("PRF_SQ")]);

  // ! 설정
  useQuery({
    queryKey: ["/setting"],
    queryFn: async () => {
      const { data } = await http.get("/setting");
      setSetting(data?.body);
      return data?.body;
    },
  });

  // ! 분석종류
  useQuery({
    queryKey: ["/test/standard"],
    queryFn: async () => {
      const { data } = await http.get("/test/standard");
      setTestType(data?.body);
      return data?.body;
    },
  });

  useQuery(
    [`/test?PRF_SQ=${PRF_SQ}`],
    async () => {
      if (!PRF_SQ) return;
      const { data } = await http.get(`/test?PRF_SQ=${PRF_SQ}`);
      setTestHistoryList(data?.body ?? []);
      return data?.body;
    },
    { enabled: !!PRF_SQ }
  );

  useQuery(
    [`/coupon?USR_SQ=${user?.USR_SQ}`],
    async () => {
      if (!user?.USR_SQ) return;
      const { data } = await http.get(`/coupon?USR_SQ=${user?.USR_SQ}`);
      if (!data?.result) return alert.error(data?.message);
      setGetCouponList(data?.body ?? []);
      return data?.body ?? [];
    },
    { enabled: !!user?.USR_SQ }
  );
};
