import i18next from "i18next";

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString(i18next.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
