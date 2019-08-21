import { peakTimes, pricing } from "./data";

export const isInPeak = (day: string, time: number) => {
  const peakTimeForDay = peakTimes[day];
  return time >= peakTimeForDay[0] && time <= peakTimeForDay[1];
};

export const getPriceForTime = (time: number) => {
  const peakTimeForDay = peakTimes["mon"]; // hardcoded
  const isInPeak = time >= peakTimeForDay[0] && time <= peakTimeForDay[1];
  const getPrice = isInPeak ? pricing["mon"].onPeak : pricing["mon"].offPeak;

  return getPrice;
};
