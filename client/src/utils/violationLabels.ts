// src/utils/violationLabels.ts

export const violationLabels: Record<
  string,
  string
> = {
  helmet_non_compliance:
    "No Helmet",

  seatbelt_non_compliance:
    "No Seatbelt",

  triple_riding:
    "Triple Riding",

  wrong_side_driving:
    "Wrong-Side Driving",

  red_light_violation:
    "Red Light Violation",

  illegal_parking:
    "Illegal Parking",
};

export function getViolationLabel(
  type: string
): string {
  return (
    violationLabels[type] ??
    type
  );
}