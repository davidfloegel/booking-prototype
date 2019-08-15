export interface BookingRule {
  id: string;
  days: string[];
  allDay: boolean;
  validBefore?: number;
  validAfter?: number;

  minLength?: number;
  allowFillSlots?: true;
  minDistanceBetweenSlots?: number;
}

export interface ExistingBooking {
  id: number;
  from: number;
  until: number;
}
