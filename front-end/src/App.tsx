import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import routes from "./assets/routes";
import { useCookies } from "react-cookie";
import { useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { userAtom } from "./assets/atoms";
import { useSetRecoilState } from "recoil";
import { http } from "./assets/functions";
import { useQuery } from "react-query";
import useWebSocket from "./hooks/useWebSocket";
import useInitial from "./hooks/useInitial";

export default () => {
  const nav = useNavigate();
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies(["PLAYMAP_TOKEN"]);
  const setUser = useSetRecoilState(userAtom);

  useWebSocket();
  useInitial();

  const path = useMemo<string>(() => location?.pathname, [location?.pathname]);

  const decodedToken: Common.User | undefined = useMemo(() => {
    if (cookies?.PLAYMAP_TOKEN) {
      try {
        return jwtDecode(cookies?.PLAYMAP_TOKEN);
      } catch (error) {
        return undefined;
      }
    }
  }, [cookies]);

  // ! 유저정보
  const { refetch } = useQuery({
    queryKey: [`/auth/user/${decodedToken?.USR_SQ}`],
    queryFn: async () => {
      const { data } = await http.get(`/auth/user/${decodedToken?.USR_SQ}`);
      setUser(data?.body);
      return data?.body;
    },
    enabled: !!decodedToken?.USR_SQ,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (decodedToken) {
      try {
        refetch();
      } catch (error) {
        removeCookie("PLAYMAP_TOKEN");
      }
    } else {
      if (
        !path?.includes("/signup") &&
        !path?.includes("/dev") &&
        !path?.includes("/music/") &&
        !path?.includes("/sharepage")
      ) {
        nav("/login");
        sessionStorage.removeItem("PRF_SQ");
      }
    }
  }, [cookies, path, decodedToken, sessionStorage]);

  return (
    <Routes>
      {routes?.map((route) => (
        <Route
          key={route?.path}
          path={route?.path}
          element={<route.element />}
        />
      ))}
    </Routes>
  );
};
