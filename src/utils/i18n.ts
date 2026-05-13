import { initReactI18next } from "react-i18next";
import i18next from "i18next";

import { resources } from "../constants";
import { useUserStore } from "../stores/userStore";

const language = useUserStore.getState().locale;

i18next.use(initReactI18next).init({
  resources,

  lng: language,

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

useUserStore.subscribe((state) => {
  if (i18next.language !== state.locale) {
    void i18next.changeLanguage(state.locale);
  }
});
