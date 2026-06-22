// services/detectTripleRiding.ts

import dotenv from "dotenv";
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
  const base64Image = imageBuffer.toString("base64");

  const response = await fetch(
    process.env.TRIPLE_RIDING_WORKFLOW_URL!,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        api_key: process.env.TRIPLE_RIDING_API_KEY,

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
    const errorText = await response.text();

    console.error(
      "Triple Riding API Error:",
      response.status,
      errorText
    );

    throw new Error(
      `Triple riding detection failed (${response.status})`
    );
  }

  const result = await response.json();

  console.log(
    "Triple Riding Raw Response:",
    JSON.stringify(result, null, 2)
  );

  const output = result?.outputs?.[0];

  if (!output) {
    console.log(
      "No output returned from workflow"
    );
    return [];
  }

  const expressions =
    output.expression_output ?? [];

  const crops =
    output.dynamic_crop_output ?? [];

  console.log(
    "Expressions:",
    JSON.stringify(expressions, null, 2)
  );

  console.log(
    "Dynamic Crops Count:",
    crops.length
  );

  const violations: TripleRidingViolation[] = [];

  for (let i = 0; i < expressions.length; i++) {
    const expression = expressions[i];

    console.log(
      `Expression[${i}]:`,
      expression
    );

    if (
      expression
        ?.toString()
        .toUpperCase()
        .replace(/\s+/g, "_") !==
      "TRIPLE_RIDING"
    ) {
      continue;
    }

    console.log(
      `Triple riding detected at index ${i}`
    );

    const prediction =
      crops?.[i]?.predictions
        ?.predictions?.[0];

    console.log(
      `Prediction[${i}]:`,
      JSON.stringify(prediction, null, 2)
    );

    if (!prediction) {
      console.warn(
        `No prediction found for index ${i}`
      );
      continue;
    }

    violations.push({
      type: "triple_riding",

      confidence:
        prediction.confidence ?? 0,

      x: prediction.x ?? 0,
      y: prediction.y ?? 0,

      width:
        prediction.width ?? 0,

      height:
        prediction.height ?? 0,
    });
  }

  console.log(
    "Final Triple Riding Violations:",
    JSON.stringify(violations, null, 2)
  );

  return violations;
}