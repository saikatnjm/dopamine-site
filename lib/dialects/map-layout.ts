// How dialect regions are drawn on the district map (data/dialects/map.ts):
// one fill colour per region and a hand-placed label anchor (viewBox units,
// 1000 wide), read off the rendered map so labels sit inside their region
// and don't collide. Pure data, safe on server and client.

/** Light fills — each region distinct from its neighbours; ink text stays AA on all. */
export const REGION_FILL: Readonly<Record<string, string>> = {
  "jashore-khulna": "#ffd8a8",
  barishal: "#b2f2bb",
  faridpur: "#ffec99",
  sylhet: "#a5d8ff",
  chattogram: "#e5dbff",
  noakhali: "#ffc9c9",
  cumilla: "#c3fae8",
  "old-dhaka": "#ff8787",
  "dhaka-region": "#d0bfff",
  mymensingh: "#96f2d7",
  rangpur: "#ffe066",
  rajshahi: "#fcc2d7",
  bogura: "#74c0fc",
};

/** Districts outside every region (Chittagong Hill Tracts). */
export const UNASSIGNED_FILL = "#e9e4d8";

/** Regions pushed into the background when others are highlighted (opaque: the ink underlay must not show through). */
export const FADED_FILL = "#f3eddf";

/** Label anchor per region, inside the region's shape. */
export const REGION_LABEL_AT: Readonly<Record<string, readonly [number, number]>> = {
  rangpur: [235, 225],
  rajshahi: [150, 485],
  bogura: [295, 410],
  mymensingh: [520, 430],
  sylhet: [800, 440],
  "dhaka-region": [425, 545],
  "old-dhaka": [485, 655],
  cumilla: [645, 735],
  noakhali: [655, 880],
  chattogram: [830, 1000],
  faridpur: [410, 765],
  barishal: [480, 935],
  "jashore-khulna": [245, 805],
};
