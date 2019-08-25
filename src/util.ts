import _ from "lodash";
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

export const getBookingIntervalStartingTimes = (
  openingHours: [number, number],
  bookingInterval: number
) => {
  const numberOfSlots =
    ((openingHours[1] - openingHours[0]) * 60) / bookingInterval;

  // TODO what to do if numberOfSlots isn't even?
  const addToSlot = bookingInterval / 60;
  return _.map(_.range(0, numberOfSlots), x => openingHours[0] + x * addToSlot);
};
