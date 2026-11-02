import { create } from "zustand";

export type AuthSheet = "login" | "terms";

type AuthSheetState = {
  sheet: AuthSheet | null;
  open: (sheet: AuthSheet) => void;
  close: () => void;
};

/** 로그인·약관 시트는 어느 화면에서든(+ 버튼, 프로필 등) 열릴 수 있어 전역 상태로 둔다. */
export const useAuthSheetStore = create<AuthSheetState>((set) => ({
  sheet: null,
  open: (sheet) => set({ sheet }),
  close: () => set({ sheet: null }),
}));
