/**
 * BOOKING RULES
 * ===============================================================================================
 *
 *  id
 *    - the id of the rule
 *
 *  days: ['mon', 'tue', ...]
 *    - what days is this rule valid on?
 *
 *  allDay: true/false
 *    - is this rule valid all day?
 *
 *  onlyInPeak: true/false
 *    - execute this rule only during peak time
 *
 *  onlyInOffPeak: true/false
 *    - execute this rule only during off peak time
 *
 *  validBefore: 18
 *    - until what time on the given days should this rule be enforced
 *
 *  validAfter: 12
 *    - after what time on the given days should this rule be enforced
 *
 *  allowDaysAhead: 2
 *    - execute this rule until 2 days before. That means you could enforce
 *      a 3h minimum booking when people book 2 weeks in advance, but allow
 *      them to book 1h bookings on the day or the day before
 *
 *  minLength: 180
 *    - the minimum length in minutes a user has to book
 *
 *  minDistanceBetweenSlots: 120
 *    - can the user leave any amount of time between bookings & opening hours?
 *      If this is set to i.e. 120 it means the user has to leave no gap or at least
 *      2 hours between existing slots
 *
 *  allowFillSlots: true/false
 *    - allow users to make bookings less than minLength if there's slots left that aren't
 *      long enough
 *    - only executed when minLength is set
 *
 *  allowPeakOverlap: true/false
 *    - allow users to book slots that start in peak and reach into off-peak times
 */
export interface BookingRule {
  id: string;
  description?: string;
  days?: string[];
  allDay?: boolean;
  onlyInPeak?: boolean;
  onlyInOffPeak?: boolean;
  validBefore?: number;
  validAfter?: number;
  allowDaysAhead?: number;

  minLength?: number;
  minDistanceBetweenSlots?: number;

  allowFillSlots?: true;
  allowPeakOverlap?: boolean;
}

export interface ExistingBooking {
  id: number;
  from: number;
  until: number;
}

export interface BookingOption {
  id: string;
  title: string;
  description?: string;
  availableDays: string[];
  discount?: number;
  price: number;
  peakPrice: number;
  rules: BookingRule[];
}
