export const WEEKDAYS_UPPER = [
  "YAKSHANBA",
  "DUSHANBA",
  "SESHANBA",
  "CHORSHANBA",
  "PAYSHANBA",
  "JUMA",
  "SHANBA",
];

export const WEEKDAYS = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

export const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

export const CALENDAR_WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

export function parseDateTime(dateStr, time = "18:00") {
  if (!dateStr) return new Date(2026, 11, 16, 18, 0);
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = String(time || "18:00").split(":").map(Number);
  if (!y || !m || !d) return new Date(2026, 11, 16, 18, 0);
  return new Date(y, m - 1, d, hh || 18, mm || 0);
}

export function getCalendarData(dateStr) {
  const date = parseDateTime(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return {
    date,
    year,
    month,
    day,
    weekday: WEEKDAYS[date.getDay()],
    weekdayUpper: WEEKDAYS_UPPER[date.getDay()],
    monthName: MONTHS[month],
  };
}

export function buildMonthGrid(year, month) {
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function getCountdown(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function googleCalendarUrl(data) {
  const date = data.date || "2026-12-16";
  const time = data.time || "18:00";
  const [h = "18", m = "00"] = time.split(":");
  const hh = String(Number(h)).padStart(2, "0");
  const mm = String(Number(m)).padStart(2, "0");
  const endHour = String((Number(h) + 2) % 24).padStart(2, "0");
  const compact = date.replaceAll("-", "");
  const text = encodeURIComponent(
    `${data.groomName || ""} & ${data.brideName || ""}'s Wedding`
  );
  const location = encodeURIComponent(
    `${data.locationName || ""}, ${data.address || ""}`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${compact}T${hh}${mm}00/${compact}T${endHour}${mm}00&location=${location}`;
}

export function formatFooterDate(dateStr) {
  const { year, day, monthName } = getCalendarData(dateStr);
  return `${day} ${monthName}, ${year}`;
}

export function invitationDateLabel(data) {
  const c = getCalendarData(data.date);
  const time = data.time ? ` • ${data.time}` : "";
  return `${c.weekdayUpper} • ${c.day} ${c.monthName} ${c.year}${time}`;
}
