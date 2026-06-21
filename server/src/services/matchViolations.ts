import type { VehicleDetection } from "./detectVehicle.js";
import type { ViolationDetection } from "./detectViolations.js";

export interface MatchedVehicleViolation {
  vehicle: VehicleDetection;

  violations: {
    type: string;
    confidence: number;
  }[];
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getCorners(box: Box) {
  return {
    left:
      box.x - box.width / 2,

    right:
      box.x + box.width / 2,

    top:
      box.y - box.height / 2,

    bottom:
      box.y + box.height / 2,
  };
}

function getExpandedVehicleBox(
  vehicle: VehicleDetection
): Box {
  return {
    x: vehicle.bbox.x,

    y:
      vehicle.bbox.y -
      vehicle.bbox.height * 0.25,

    width:
      vehicle.bbox.width * 1.2,

    height:
      vehicle.bbox.height * 1.8,
  };
}

function calculateOverlapArea(
  vehicle: VehicleDetection,
  violation: ViolationDetection
): number {
  const vehicleBox =
    getCorners(
      getExpandedVehicleBox(
        vehicle
      )
    );

  const violationBox =
    getCorners({
      x: violation.x,
      y: violation.y,
      width:
        violation.width,
      height:
        violation.height,
    });

  const overlapWidth =
    Math.max(
      0,
      Math.min(
        vehicleBox.right,
        violationBox.right
      ) -
        Math.max(
          vehicleBox.left,
          violationBox.left
        )
    );

  const overlapHeight =
    Math.max(
      0,
      Math.min(
        vehicleBox.bottom,
        violationBox.bottom
      ) -
        Math.max(
          vehicleBox.top,
          violationBox.top
        )
    );

  return (
    overlapWidth *
    overlapHeight
  );
}

function findOwnerVehicle(
  violation: ViolationDetection,
  vehicles: VehicleDetection[]
): VehicleDetection | null {
  let bestVehicle: VehicleDetection | null =
    null;

  let bestOverlap = 0;

  for (const vehicle of vehicles) {
    const overlap =
      calculateOverlapArea(
        vehicle,
        violation
      );

    if (
      overlap > bestOverlap
    ) {
      bestOverlap = overlap;
      bestVehicle = vehicle;
    }
  }

  console.log(
    "Violation:",
    violation
  );

  console.log(
    "Best overlap:",
    bestOverlap
  );

  console.log(
    "Matched vehicle:",
    bestVehicle
  );

  if (bestOverlap <= 0) {
    return null;
  }

  return bestVehicle;
}

export function matchViolations(
  vehicles: VehicleDetection[],
  violations: ViolationDetection[]
): MatchedVehicleViolation[] {
  const matched =
    new Map<
      VehicleDetection,
      MatchedVehicleViolation
    >();

  for (const vehicle of vehicles) {
    matched.set(vehicle, {
      vehicle,
      violations: [],
    });
  }

  for (const violation of violations) {
    const owner =
      findOwnerVehicle(
        violation,
        vehicles
      );

    if (!owner) {
      continue;
    }

    matched
      .get(owner)
      ?.violations.push({
        type:
          violation.type,

        confidence:
          violation.confidence,
      });
  }

  return Array.from(
    matched.values()
  ).filter(
    (item) =>
      item.violations.length >
      0
  );
}