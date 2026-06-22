// services/detectTripleRiding.ts
import dotenv from 'dotenv';
dotenv.config();
export interface TripleRidingViolation {
  type: string;
  confidence: number;

  x: number;
  y: number;

  width: number;
  height: number;
}

export async function detectTripleRiding(
  imageBuffer: Buffer
): Promise<TripleRidingViolation[]> {
  const base64Image =
    imageBuffer.toString("base64");

  const response = await fetch(
    process.env.TRIPLE_RIDING_WORKFLOW_URL!,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        api_key:
          process.env
            .TRIPLE_RIDING_API_KEY,

        inputs: {
          image: {
            type: "base64",
            value: base64Image,
          },
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Triple riding detection failed"
    );
  }

  const result =
    await response.json();

  const output = result?.[0];

  if (!output) {
    return [];
  }

  const violations: TripleRidingViolation[] =
    [];

  const expressions =
    output.expression_output ??
    [];

  const crops =
    output.dynamic_crop_output ??
    [];

  for (
    let i = 0;
    i < expressions.length;
    i++
  ) {
    if (
      expressions[i] !==
      "TRIPLE_RIDING"
    ) {
      continue;
    }

    const prediction =
      crops[i]?.predictions
        ?.predictions?.[0];

    if (!prediction) {
      continue;
    }

    violations.push({
      type:
        "triple_riding",

      confidence:
        prediction.confidence,

      x: prediction.x,

      y: prediction.y,

      width:
        prediction.width,

      height:
        prediction.height,
    });
  }

  return violations;
}