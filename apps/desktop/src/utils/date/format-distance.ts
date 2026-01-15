import { now, type ZonedDateTime } from "@internationalized/date";

export function formatDistanceToNow(date: ZonedDateTime) {
  const time = now("UTC");
  const diff = time.toDate().getTime() - date.toDate().getTime();
  if (diff < 0) {
    return "Aujourd'hui";
  }

  if (diff < 60 * 1000) {
    return "Il y a moins d'une minute";
  }

  if (diff < 60 * 60 * 1000) {
    return `Il y a ${Math.round(diff / (60 * 1000))} minute(s)`;
  }

  if (diff < 24 * 60 * 60 * 1000) {
    return `Il y a ${Math.round(diff / (60 * 60 * 1000))} heure(s)`;
  }

  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `Il y a ${Math.round(diff / (24 * 60 * 60 * 1000))} jour(s)`;
  }

  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return `Il y a ${Math.round(diff / (7 * 24 * 60 * 60 * 1000))} semaine(s)`;
  }

  return `Il y a ${Math.round(diff / (30 * 24 * 60 * 60 * 1000))} mois`;
}
