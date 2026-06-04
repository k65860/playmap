import { lazy } from "react";

const Login = lazy(() => import("../pages/login"));
const Result = lazy(() => import("../pages/result"));
const SharingResult = lazy(() => import("../pages/result/sharing-result"));
const Test = lazy(() => import("../pages/test/test"));
const TestChoice = lazy(() => import("../pages/test/index"));
const Profile = lazy(() => import("../pages/profile"));
const MyInfo = lazy(() => import("../pages/my-info"));
const Signup = lazy(() => import("../pages/signup"));
const Choice = lazy(() => import("../pages/signup/choice"));
const Create = lazy(() => import("../pages/signup/create"));
const MyCoupon = lazy(() => import("../pages/my-coupon"));
const buyCoupon = lazy(() => import("../pages/buy-coupon"));
const TestHistory = lazy(() => import("../pages/test-history"));
const Gpt = lazy(() => import("../pages/gpt"));
const Music = lazy(() => import("../pages/music"));
const CharacterMusic = lazy(() => import("../pages/character-music"));
const ExchangeItem = lazy(() => import("../pages/exchange-item"));

const PlayHistory = lazy(() => import("../pages/play-history"));

// 관리자
const Admin = lazy(() => import("../pages/admin"));
const UserInfo = lazy(() => import("../pages/admin/userInfo"));

const Dev = lazy(() => import("../pages/dev"));

interface Route {
  path: string;
  name: string;
  element: (() => JSX.Element) | React.LazyExoticComponent<() => JSX.Element>;
}

const routes: Route[] = [
  {
    path: "/",
    name: "결과",
    element: Result,
  },
  {
    path: "/sharepage",
    name: "결과공유 페이지",
    element: SharingResult,
  },
  {
    path: "/profile",
    name: "프로필",
    element: Profile,
  },
  {
    path: "/myInfo",
    name: "내정보",
    element: MyInfo,
  },
  {
    path: "/signup",
    name: "회원가입",
    element: Signup,
  },
  {
    path: "/signup/choice",
    name: "회원가입 선택",
    element: Choice,
  },
  {
    path: "/signup/create",
    name: "회원가입 진행",
    element: Create,
  },
  {
    path: "/login",
    name: "로그인",
    element: Login,
  },
  {
    path: "/mycoupon",
    name: "나의 쿠폰",
    element: MyCoupon,
  },
  {
    path: "/buycoupon",
    name: "쿠폰 구매",
    element: buyCoupon,
  },
  {
    path: "/test/start",
    name: "분석",
    element: Test,
  },
  {
    path: "/test/choice",
    name: "분석선택",
    element: TestChoice,
  },
  {
    path: "/testhistory",
    name: "분석이력",
    element: TestHistory,
  },
  {
    path: "/admin",
    name: "관리자 홈",
    element: Admin,
  },
  {
    path: "/admin/userinfo",
    name: "회원정보",
    element: UserInfo,
  },
  {
    path: "/ai",
    name: "플레이맵 AI 솔루션",
    element: Gpt,
  },
  {
    path: "/music",
    name: "AI 음원듣기",
    element: Music,
  },
  {
    path: "/music/:CHAR_SQ",
    name: "캐릭터 음원듣기",
    element: CharacterMusic,
  },
  {
    path: "/exchangeitem",
    name: "추천인 교환 상품",
    element: ExchangeItem,
  },
  {
    path: "/dev",
    name: "개발용",
    element: Dev,
  },
  {
    path: "/playhistory",
    name: "활동 기록",
    element: PlayHistory,
  },
];

export default routes;
