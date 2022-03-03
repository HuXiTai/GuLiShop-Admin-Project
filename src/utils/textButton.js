import store from "@/store";

export function textButton(str) {
  return !store.getters.buttons.includes(str);
}
