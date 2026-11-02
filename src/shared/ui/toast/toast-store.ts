import { create } from "zustand";

/** README: 토스트는 2.6초 후 사라진다 */
export const TOAST_DURATION_MS = 2600;

type ToastState = {
  message: string;
  /** 같은 문구가 연달아 떠도 진입 모션이 다시 재생되도록 하는 키 */
  id: number;
  show: (message: string) => void;
  hide: () => void;
};

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  id: 0,
  show: (message) => {
    clearTimeout(timer);
    set((s) => ({ message, id: s.id + 1 }));
    timer = setTimeout(() => set({ message: "" }), TOAST_DURATION_MS);
  },
  hide: () => {
    clearTimeout(timer);
    set({ message: "" });
  },
}));

/** 컴포넌트 밖(이벤트 핸들러, 뮤테이션 콜백)에서도 쓸 수 있는 토스트 호출. */
export const toast = (message: string) => useToastStore.getState().show(message);
