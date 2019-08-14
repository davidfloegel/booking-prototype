import _ from "lodash";

import { BookingRule, ExistingBooking } from "./interfaces";

// get the booking rules that we actually need to verify
// based on the given day and times
export const getRulesToVerifiy = (
  rules: BookingRule[],
  day: string,
  slot: [number, number]
) => {
  return rules.filter(r => {
    const isOnDay = r.days.indexOf(day) > -1;
    const isAllDay = r.allDay;

    const validBefore =
      r.validBefore && slot[0] <= r.validBefore && slot[1] <= r.validBefore;
    const validAfter =
      r.validAfter && slot[0] >= r.validAfter && slot[1] >= r.validAfter;

    return isOnDay && (isAllDay || validBefore || validAfter);
  });
};

// main function that takes the selected booking slot
// and validates it against the studios booking rules
export default (
  openingHours: [number, number],
  existingSlots: ExistingBooking[],
  rulesToVerify: BookingRule[],
  selectedSlot: [number, number]
) => {
  // check if bookings starts + ends within opening hours
  const startsBeforeOpening = selectedSlot[0] < openingHours[0];
  const endsAfterClosing = selectedSlot[1] >= openingHours[1];

  if (startsBeforeOpening || endsAfterClosing) {
    throw new Error(
      `Selected slot isn't within opening hours (${openingHours[0]} - ${
        openingHours[1]
      })`
    );
  }

  // check if booking is overlapping existing slots
  const isOverlapping = existingSlots.filter((e: ExistingBooking) => {
    const [f, u] = selectedSlot;
    const { from, until } = e;

    const overLapsBefore = f <= from && u > from;
    const overLapsAfter = f < until && u >= until;
    const overLapsInbetween = f >= from && u < until;

    return overLapsBefore || overLapsAfter || overLapsInbetween;
  });

  if (isOverlapping.length > 0) {
    throw new Error("Selected slot is overlapping an existing slot");
  }

  rulesToVerify.forEach((rule: BookingRule) => {
    if (rule.minLength) {
      const length = selectedSlot[1] - selectedSlot[0];
      if (length < rule.minLength) {
        throw new Error("You have to book at least 3 hours");
      }
    }

    if (rule.minDistanceBetweenSlots) {
      // find slots starting before selected time
      const before = existingSlots.filter(
        (b: ExistingBooking) => b.until <= selectedSlot[0]
      );
      const after = existingSlots.filter(
        (b: ExistingBooking) => b.from >= selectedSlot[1]
      );

      // check if enough distance to opening time
      const distanceToOpeningHour = (selectedSlot[0] - openingHours[0]) * 60;
      if (
        distanceToOpeningHour > 0 &&
        distanceToOpeningHour < rule.minDistanceBetweenSlots
      ) {
        throw new Error(
          `Please leave no gap or at least ${rule.minDistanceBetweenSlots /
            60} hours between the opening hour and your slot`
        );
      }

      // check if enough distance to closing time
      const distanceToClosingHour = (openingHours[1] - selectedSlot[1]) * 60;
      if (
        distanceToClosingHour > 0 &&
        distanceToClosingHour < rule.minDistanceBetweenSlots
      ) {
        throw new Error(
          `Please leave no gap or at least ${rule.minDistanceBetweenSlots /
            60} hours between the closing hour and your slot`
        );
      }

      // check if enough distance to preceeding booking
      if (before.length > 0) {
        const last = before[before.length - 1];

        const distance = (selectedSlot[0] - last.until) * 60;

        if (distance > 0 && distance < rule.minDistanceBetweenSlots) {
          throw new Error(
            `Please leave no gap or at least ${rule.minDistanceBetweenSlots /
              60} hours between existing bookings and your slot`
          );
        }
      }

      // check if enough distance to following booking
      if (after.length > 0) {
        const first = after[0];
        const distance = (first.from - selectedSlot[1]) * 60;

        if (distance > 0 && distance < rule.minDistanceBetweenSlots) {
          throw new Error(
            `Please leave no gap or at least ${rule.minDistanceBetweenSlots /
              60} hours between existing bookings and your slot`
          );
        }
      }
    }
  });

  return null;
};
