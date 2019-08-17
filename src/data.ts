import { ExistingBooking, BookingRule } from "./interfaces";

export const openingHours = [
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24
];

export const bookingRules: BookingRule[] = [
  {
    id: "1",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    allDay: true,
    minLength: 180,
    allowFillSlots: true,
    minDistanceBetweenSlots: 120
  }
];

export const busySlots: ExistingBooking[] = [
  // { id: 1, from: 10, until: 13 },
  // { id: 2, from: 15, until: 16 },
  // { id: 3, from: 17, until: 19 },
  // { id: 4, from: 23, until: 25 }
];

export const peakTimes = {
  mon: [17, 24],
  tue: [17, 24],
  wed: [17, 24],
  thu: [17, 24],
  fri: [17, 24],
  sat: [14, 23],
  sun: [14, 23]
};

export const pricing = {
  mon: { offPeak: 5, onPeak: 10 }
};
