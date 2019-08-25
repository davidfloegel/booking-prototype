import { ExistingBooking, BookingRule, BookingOption } from "./interfaces";

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

export const dailyOpeningHours: any = {
  mon: [10, 24],
  tue: [10, 24],
  wed: [10, 24],
  thu: [10, 24],
  fri: [10, 24],
  sat: [10, 22],
  sun: [10, 22]
};

export const bookingRules: BookingRule[] = [
  {
    id: "MIN-3-HOURS-DURING-PEAK",
    days: ["mon", "tue", "wed", "thu", "fri"],
    allDay: true,
    minLength: 180,
    allowFillSlots: true,
    minDistanceBetweenSlots: 120
  },
  {
    id: "MIN-4-HOURS-ON-WEEKEND",
    days: ["sat", "sun"],
    allDay: true,
    minLength: 240,
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

export const peakTimes: any = {
  mon: [17, 24],
  tue: [17, 24],
  wed: [17, 24],
  thu: [17, 24],
  fri: [17, 24],
  sat: [14, 22],
  sun: [14, 22]
};

export const pricing = {
  mon: { offPeak: 5, onPeak: 10 }
};

export const bookingOptions: BookingOption[] = [
  {
    id: "1",
    title: "Solo Practice",
    availableDays: ["mon", "tue", "wed", "thu", "fri"],
    price: 6.5,
    peakPrice: 10,
    description:
      "Solo slots can only be booked during peak time. You may book last minute solo slots during peak time on the day or day before. Minimum length for peak time is 2 hours, but you may fill any 1h slot that is available",
    rules: [
      {
        id: "SOLO-STANDARD",
        onlyInOffPeak: true,
        minDistanceBetweenSlots: 120
      },
      {
        id: "SOLO-PEAK",
        onlyInPeak: true,
        allowDaysAhead: 1,
        minLength: 120,
        allowFillSlots: true,
        minDistanceBetweenSlots: 120
      }
    ]
  },
  {
    id: "2",
    title: "Band & Teaching Slot",
    availableDays: ["mon", "tue", "wed", "thu", "fri"],
    price: 10,
    peakPrice: 15,
    description:
      "Teaching slots have to be at least 3 hours long. Peak time teaching slots can only be booked on the day or the day before. You may fill any 1h or 2h slots that are available",
    rules: [
      {
        id: "TEACHING-STANDARD",
        onlyInOffPeak: true,
        minLength: 180,
        allowFillSlots: true,
        minDistanceBetweenSlots: 120
      },
      {
        id: "TEACHING-PEAK",
        onlyInPeak: true,
        minLength: 180,
        allowFillSlots: true,
        allowDaysAhead: 1,
        minDistanceBetweenSlots: 120
      }
    ]
  },
  {
    id: "3",
    title: "Weekend Bookings",
    availableDays: ["sat", "sun"],
    price: 10,
    peakPrice: 12,
    description:
      "On weekends you can only book 4 hours or any gaps you might find.",
    rules: [
      {
        id: "WEEKEND-STANDARD",
        minLength: 240,
        requireMultiplesOfLength: true,
        bookingInterval: 240,
        allowFillSlots: true,
        minDistanceBetweenSlots: 120
      }
    ]
  }
];
