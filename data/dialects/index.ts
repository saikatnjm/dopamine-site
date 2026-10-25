import type { DialectContent } from "@/lib/dialects/types";
import { CONCEPTS } from "./concepts";
import { DISTRICTS } from "./districts";
import { barishalForms } from "./forms/barishal";
import { boguraForms } from "./forms/bogura";
import { chattogramForms } from "./forms/chattogram";
import { cumillaForms } from "./forms/cumilla";
import { dhakaRegionForms } from "./forms/dhaka-region";
import { faridpurForms } from "./forms/faridpur";
import { jashoreKhulnaForms } from "./forms/jashore-khulna";
import { mymensinghForms } from "./forms/mymensingh";
import { noakhaliForms } from "./forms/noakhali";
import { oldDhakaForms } from "./forms/old-dhaka";
import { rajshahiForms } from "./forms/rajshahi";
import { rangpurForms } from "./forms/rangpur";
import { sylhetForms } from "./forms/sylhet";
import { REGIONS } from "./regions";
import { SOURCES } from "./sources";

// All dialect content in one object. Server-side in practice: pages hand the
// client only what it may show. Read it through lib/dialects/content.ts
// (which validates it).

export const DIALECT_CONTENT: DialectContent = {
  districts: DISTRICTS,
  regions: REGIONS,
  sources: SOURCES,
  concepts: CONCEPTS,
  forms: [
    ...jashoreKhulnaForms,
    ...barishalForms,
    ...faridpurForms,
    ...sylhetForms,
    ...chattogramForms,
    ...noakhaliForms,
    ...cumillaForms,
    ...oldDhakaForms,
    ...dhakaRegionForms,
    ...mymensinghForms,
    ...rangpurForms,
    ...rajshahiForms,
    ...boguraForms,
  ],
};
