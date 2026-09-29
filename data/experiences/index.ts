import type { Experience } from "@/lib/experience/types";
import { dhakaCng } from "./dhaka-cng";
import { dhakaBus } from "./dhaka-bus";
import { fakeShopping } from "./fake-shopping";
import { foodDelivery } from "./food-delivery";
import { houseRent } from "./house-rent";
import { jobResignation } from "./job-resignation";
import { lifeDecision } from "./life-decision";

// Register every experience here. Order = default display order.
// Adding one: create data/experiences/<slug>.ts, import it, add it below.
export const experiences: Experience[] = [
  dhakaCng,
  foodDelivery,
  dhakaBus,
  jobResignation,
  fakeShopping,
  houseRent,
  lifeDecision,
];
