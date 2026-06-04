import { atom } from "recoil";

export const userAtom = atom<Common.User>({
  key: "userAtom",
  default: undefined,
});
export const settingAtom = atom<Common.Setting[]>({
  key: "settingAtom",
  default: undefined,
});
export const testTypeAtom = atom<Test.Type[]>({
  key: "testTypeAtom",
  default: undefined,
});
export const testHistoryListAtom = atom<Test.History[]>({
  key: "testListListAtom",
  default: undefined,
});
export const getCouponListAtom = atom<Coupon[]>({
  key: "getCouponListAtom",
  default: undefined,
});
