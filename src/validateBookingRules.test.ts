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

  it("throws an error if slot does not match minLength", () => {
    const rules: BookingRule[] = [
      { id: "1", days: ["tue"], allDay: true, minLength: 180 }
    ];
    expect(() => validateSlot(openingHours, [], rules, [13, 14])).toThrowError(
      "You have to book at least 3 hours"
    );

    expect(() =>
      validateSlot(openingHours, [], rules, [12, 14])
    ).not.toThrowError();
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
        validateSlot(openingHours, [], rules, [18, 22])
      ).toThrowError(
        "Please leave no gap or at least 2 hours between the closing hour and your slot"
      );

      expect(() =>
        validateSlot(openingHours, [], rules, [18, 21])
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
        validateSlot(openingHours, existing, rules, [15, 16])
      ).toThrowError("You have to book at least 3 hours");
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
        validateSlot(openingHours, existing, rules, [15, 17])
      ).not.toThrowError();
    });
  });
});
