import validateSlot, { getRulesToVerifiy } from "./validateBookingRules";
import { BookingRule, ExistingBooking } from "./interfaces";

const mockBookingRules: BookingRule[] = [
  {
    id: "rule1",
    days: ["mon", "tue", "wed"],
    allDay: true
  },
  {
    id: "rule2",
    days: ["thu"],
    allDay: false,
    validBefore: 18
  },
  {
    id: "rule3",
    days: ["tue"],
    allDay: false,
    validAfter: 10
  },
  {
    id: "rule4",
    days: ["tue"],
    allDay: false,
    validBefore: 18
  }
];

describe("getRulesToVerifiy", () => {
  it("returns the right booking rules", () => {
    const rules = getRulesToVerifiy(mockBookingRules, "tue", [13, 18]);
    expect(rules).toHaveLength(3);

    expect(rules[0]).toHaveProperty("id", "rule1");
    expect(rules[1]).toHaveProperty("id", "rule3");
    expect(rules[2]).toHaveProperty("id", "rule4");
  });
});

describe("validateBookingRules", () => {
  const openingHours: [number, number] = [10, 24];

  describe("Opening Hours", () => {
    it("throws an error if booking starts before opening hours", () => {
      expect(() => validateSlot(openingHours, [], [], [8, 13])).toThrowError(
        "Selected slot isn't within opening hours (10 - 24)"
      );
    });

    it("throws an error if booking ends after opening hours", () => {
      expect(() => validateSlot([10, 18], [], [], [15, 19])).toThrowError(
        "Selected slot isn't within opening hours (10 - 18)"
      );
    });

    it("throws an error if booking starts and ends before opening hours", () => {
      expect(() => validateSlot(openingHours, [], [], [6, 10])).toThrowError(
        "Selected slot isn't within opening hours (10 - 24)"
      );
    });

    it("throws an error if booking starts and ends after opening hours", () => {
      expect(() => validateSlot([10, 18], [], [], [18, 20])).toThrowError(
        "Selected slot isn't within opening hours (10 - 18)"
      );
    });
  });

  describe("Overlaps", () => {
    const rules: BookingRule[] = [];
    const existing: ExistingBooking[] = [{ id: 1, from: 12, until: 17 }];

    it("throws an error if slot overlaps a following slot", () => {
      expect(() =>
        validateSlot(openingHours, existing, rules, [10, 12])
      ).not.toThrowError();

      expect(() =>
        validateSlot(openingHours, existing, rules, [10, 13])
      ).toThrowError("Selected slot is overlapping an existing slot");
    });

    it("throws an error if slot overlaps a preceeding slot", () => {
      expect(() =>
        validateSlot(openingHours, existing, rules, [16, 18])
      ).toThrowError("Selected slot is overlapping an existing slot");
    });

    it("throws an error if slot is within an existing slot", () => {
      expect(() =>
        validateSlot(openingHours, existing, rules, [17, 20])
      ).not.toThrowError();

      expect(() =>
        validateSlot(openingHours, existing, rules, [13, 14])
      ).toThrowError("Selected slot is overlapping an existing slot");
    });
  });

  describe("minLength", () => {
    it("throws an error if slot does not match minLength", () => {
      const rules: BookingRule[] = [
        { id: "1", days: ["tue"], allDay: true, minLength: 180 }
      ];
      expect(() =>
        validateSlot(openingHours, [], rules, [13, 14], true)
      ).toThrowError("You have to book at least 3 hours");

      expect(() =>
        validateSlot(openingHours, [], rules, [12, 14])
      ).not.toThrowError();
    });

    it("throws an error if requireMultiplesOfLengths is set to true", () => {
      const rules: BookingRule[] = [
        {
          id: "1",
          days: ["tue"],
          allDay: true,
          minLength: 120,
          requireMultiplesOfLength: true
        }
      ];

      expect(() =>
        validateSlot(openingHours, [], rules, [13, 16], true)
      ).toThrowError(
        "You have to book in multiples of 2 hours (i.e. 2h, 4h, 6h etc...)"
      );

      expect(() =>
        validateSlot(openingHours, [], rules, [12, 14], true)
      ).not.toThrowError();
    });
  });

  describe("bookingInterval", () => {
    it("throws an error if the user tries booking an a time that is not a correct interval", () => {
      const rules: BookingRule[] = [
        {
          id: "1",
          days: ["tue"],
          allDay: true,
          minLength: 120,
          bookingInterval: 240
        }
      ];

      expect(() => validateSlot([10, 22], [], rules, [13, 13])).toThrowError(
        "You can only book slots starting at 10:00, 14:00, 18:00"
      );

      expect(() =>
        validateSlot(openingHours, [], rules, [10, 10])
      ).not.toThrowError();
    });
  });

  describe("minDistanceBetweenSlots", () => {
    const rules: BookingRule[] = [
      {
        id: "1",
        days: ["tue"],
        allDay: true,
        minDistanceBetweenSlots: 120
      }
    ];

    it("throws an error if slot is too close to opening hour", () => {
      expect(() =>
        validateSlot(openingHours, [], rules, [11, 15])
      ).toThrowError(
        "Please leave no gap or at least 2 hours between the opening hour and your slot"
      );
    });

    it("throws an error if slot is too close to closing hour", () => {
      expect(() =>
        validateSlot(openingHours, [], rules, [18, 22], true)
      ).toThrowError(
        "Please leave no gap or at least 2 hours between the closing hour and your slot"
      );

      expect(() =>
        validateSlot(openingHours, [], rules, [18, 21], true)
      ).not.toThrowError();
    });

    it("throws an error if slot is too close to a previous existing slot", () => {
      const existing: ExistingBooking[] = [{ id: 1, from: 10, until: 12 }];

      expect(() =>
        validateSlot(openingHours, existing, rules, [13, 15])
      ).toThrowError(
        "Please leave no gap or at least 2 hours between existing bookings and your slot"
      );
    });

    it("throws an error if slot is too close to a following existing slot", () => {
      const existing: ExistingBooking[] = [{ id: 1, from: 15, until: 20 }];
      expect(() =>
        validateSlot(openingHours, existing, rules, [10, 13])
      ).toThrowError(
        "Please leave no gap or at least 2 hours between existing bookings and your slot"
      );
    });

    it("throws an error if slot is too close to a surrounding existing slot", () => {
      const existing: ExistingBooking[] = [
        { id: 1, from: 12, until: 15 },
        { id: 2, from: 20, until: 22 }
      ];
      expect(() =>
        validateSlot(openingHours, existing, rules, [16, 19])
      ).toThrowError(
        "Please leave no gap or at least 2 hours between existing bookings and your slot"
      );
    });

    it("allows the user to book slots straight after the first busy slot if busy slot is the first hours of the day", () => {
      const existing: ExistingBooking[] = [{ id: 1, from: 10, until: 11 }];
      expect(() =>
        validateSlot(openingHours, existing, rules, [11, 13])
      ).not.toThrowError();
    });

    it("allows the user to book slots up to last busy slot if busy slot is the last hour(s) of the day", () => {
      const existing: ExistingBooking[] = [{ id: 1, from: 23, until: 24 }];
      expect(() =>
        validateSlot(openingHours, existing, rules, [16, 23], true)
      ).not.toThrowError();
    });
  });

  describe("allowFillSlots", () => {
    it("throws an error if the user is not allowed to fill slots less with length than the minLength", () => {
      const rules: BookingRule[] = [
        {
          id: "1",
          days: ["mon"],
          allDay: true,
          minLength: 180
        }
      ];

      const existing = [
        { id: 1, from: 12, until: 15 },
        { id: 2, from: 17, until: 20 }
      ];

      expect(() =>
        validateSlot(openingHours, existing, rules, [15, 16], true)
      ).toThrowError("You have to book at least 3 hours");
    });

    it("does not throw an error if user fills a slot starting from opening hour to first slot", () => {
      const rules: BookingRule[] = [
        {
          id: "1",
          days: ["mon"],
          allDay: true,
          minLength: 120,
          allowFillSlots: true
        }
      ];

      const existing = [{ id: 1, from: 11, until: 15 }];

      expect(() =>
        validateSlot(openingHours, existing, rules, [10, 11], true)
      ).not.toThrowError();
    });

    it("does not throw an error if user fills a slot starting after last busy slot and ending on closing hour", () => {
      const rules: BookingRule[] = [
        {
          id: "1",
          days: ["mon"],
          allDay: true,
          minLength: 120,
          allowFillSlots: true
        }
      ];

      const existing = [{ id: 1, from: 18, until: 23 }];

      expect(() =>
        validateSlot(openingHours, existing, rules, [23, 24], true)
      ).not.toThrowError();
    });

    it("does not throw an error if user is allowed to fill slots with length less than minLength", () => {
      const rules: BookingRule[] = [
        {
          id: "1",
          days: ["mon"],
          allDay: true,
          minLength: 180,
          allowFillSlots: true
        }
      ];

      const existing = [
        { id: 1, from: 12, until: 15 },
        { id: 2, from: 17, until: 20 }
      ];

      expect(() =>
        validateSlot(openingHours, existing, rules, [15, 17], true)
      ).not.toThrowError();
    });
  });
});
