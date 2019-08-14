export interface BookingRule {
  id: string;
  days: string[];
  allDay: boolean;
  validBefore?: number;
  validAfter?: number;

  minLength?: number;
  allowFillSlots?: number;
  minDistanceBetweenSlots?: number;
}
