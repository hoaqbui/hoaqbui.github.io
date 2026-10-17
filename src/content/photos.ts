// the LTX prompt a shot was rendered from, split into its fields (v3)
export type Shot = {
  webm: string;
  mp4: string;
  webmBytes: number;
  mp4Bytes: number;
  soundSource: "LTX 2.5" | "Scored from frames";
  subject: string;
  whatHappens: string;
  camera: string;
  sound: string;
};

export type Photo = {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  place: string;
  title: string;
  alt: string;
  // vertical crop position in the 2.39:1 frame, percent (default 50, centred)
  focusY?: number;
  shot?: Shot;
};

export const photos: Photo[] = [
  {
    id: "jp-29",
    src: "/photos/jp-29.webp",
    thumb: "/photos/jp-29-thumb.webp",
    width: 1200,
    height: 800,
    place: "JAPAN · 2023",
    title: "Looking out from the pavilion",
    focusY: 70,
    alt: "View out of a dark wooden pavilion to green hills",
  },
  {
    id: "cz-51",
    src: "/photos/cz-51.webp",
    thumb: "/photos/cz-51-thumb.webp",
    width: 1600,
    height: 1143,
    place: "CZECHIA · 2023",
    title: "The passage",
    alt: "Wooden passage opening onto a bright street",
  },
  {
    id: "cz-34",
    src: "/photos/cz-34.webp",
    thumb: "/photos/cz-34-thumb.webp",
    width: 1600,
    height: 900,
    place: "CZECHIA · 2023",
    title: "Night on the river",
    alt: "River at night with city lights",
    shot: {
      webm: "/photos/shots/cz-34.webm",
      mp4: "/photos/shots/cz-34.mp4",
      webmBytes: 1049793,
      mp4Bytes: 1112751,
      soundSource: "LTX 2.5",
      subject: "a wide shot from above the bank of a broad river at blue hour. In the middle of the river a small white pedal boat carries a lamp and people in silhouette, pedalling slowly. Behind it a dark wooded hill rises against a deep blue sky, a lit lookout tower on its crest; warm streetlights line the far bank, lit buildings sit on the right, and golden reflections streak the water on the left.",
      whatHappens: "The boat glides at an easy pace to the right, its lamp swinging slightly; a V-shaped wake opens behind it and rolls outward in thin lines. As the wake reaches the golden reflections, they break into trembling pieces and slowly gather again. Near the bank, a moored pedal boat rocks gently as the ripples arrive. A few clouds drift across the blue sky.",
      camera: "The camera remains static.",
      sound: "the boat’s paddle wheel churning in a slow rhythm, water slapping its hull, laughter carrying across the water from the bank, and a tram bell far across the city.",
    },
  },
  {
    id: "jp-16",
    src: "/photos/jp-16.webp",
    thumb: "/photos/jp-16-thumb.webp",
    width: 1200,
    height: 800,
    place: "JAPAN · 2023",
    title: "Low tide",
    alt: "Torii gate at low tide",
  },
  {
    id: "cz-17",
    src: "/photos/cz-17.webp",
    thumb: "/photos/cz-17-thumb.webp",
    width: 1600,
    height: 899,
    place: "CZECHIA · 2023",
    title: "Small figure, big wall",
    alt: "A lone figure beside a patterned wall",
    shot: {
      webm: "/photos/shots/cz-17.webm",
      mp4: "/photos/shots/cz-17.mp4",
      webmBytes: 1440601,
      mp4Bytes: 1037534,
      soundSource: "Scored from frames",
      subject: "a wide shot at eye level across a cobbled street toward the long facade of a Renaissance palace. At the far left, small against the wall, a lone figure in dark clothes walks along the pavement. The facade fills the frame, its plaster scored in a repeating pattern of carved diamond blocks, topped on the left by an ornate frieze and stone pinnacles; on the right it rises a storey higher with tall windows. Two bicycles lean beside a dark wooden door near a tall black lamppost; the pavement runs in pale and dark stripes.",
      whatHappens: "The figure walks at an unhurried pace, arms swinging lightly, along the striped pavement to the left edge and steps out of frame. The long wall is left empty and still. Then a cloud passes and soft light spreads across the facade, lifting the carved diamond pattern into relief.",
      camera: "The camera remains static.",
      sound: "footsteps on stone paving, echoing off the facade and fading as the figure leaves, pigeons cooing on a ledge, and a bicycle bell once, a street away.",
    },
  },
  {
    id: "jp-28",
    src: "/photos/jp-28.webp",
    thumb: "/photos/jp-28-thumb.webp",
    width: 1200,
    height: 675,
    place: "JAPAN · 2023",
    title: "Toward the light",
    alt: "Black-and-white pavilion with a walking figure",
    shot: {
      webm: "/photos/shots/jp-28.webm",
      mp4: "/photos/shots/jp-28.mp4",
      webmBytes: 1264235,
      mp4Bytes: 1114602,
      soundSource: "Scored from frames",
      subject: "a wide shot at low height across the floor of a vast, dark wooden hall. In the middle distance a lone figure in silhouette walks from left to right in front of a long row of bright, open windows. Thick round wooden pillars stand in the foreground and recede into shadow; the polished floorboards shine like water, holding long reflections of the windows and pillars. At the far left, near a bright doorway, a second figure carrying shopping bags heads out.",
      whatHappens: "The walker crosses at a steady, unhurried pace, a dark cut-out against the glowing windows, their reflection gliding beneath them on the floor; they pass behind a thick pillar and disappear into its shadow. At the same time, the figure with the bags steps through the doorway and out of frame on the left, leaving the hall empty.",
      camera: "The camera remains static.",
      sound: "slow footsteps on old floorboards with a creak under one step, shopping bags rustling and fading out, the hush of a large wooden hall, and cicadas outside the windows.",
    },
  },
  {
    id: "cz-58",
    src: "/photos/cz-58.webp",
    thumb: "/photos/cz-58-thumb.webp",
    width: 1600,
    height: 900,
    place: "CZECHIA · 2023",
    title: "Red roofs",
    alt: "Red roofs of an old town",
  },
  {
    id: "jp-40",
    src: "/photos/jp-40.webp",
    thumb: "/photos/jp-40-thumb.webp",
    width: 1200,
    height: 674,
    place: "JAPAN · 2023",
    title: "A seat in the garden",
    alt: "A person sits in a pavilion facing a green garden",
  },
  {
    id: "br-ipanema-sunset",
    src: "/photos/br-ipanema-sunset.webp",
    thumb: "/photos/br-ipanema-sunset-thumb.webp",
    width: 1280,
    height: 720,
    place: "BRAZIL · 2024",
    title: "Ipanema, last light",
    alt: "Ipanema beach at sunset, beachgoers in silhouette below the twin peaks of Dois Irmãos",
  },
  {
    id: "tw-temple-roofs-coast",
    src: "/photos/tw-temple-roofs-coast.webp",
    thumb: "/photos/tw-temple-roofs-coast-thumb.webp",
    width: 1280,
    height: 914,
    place: "TAIWAN · 2023",
    title: "Roofs above the bay",
    alt: "Ornate temple rooftops with dragon carvings above green hills and a grey bay",
  },
  {
    id: "ie-rain-road",
    src: "/photos/ie-rain-road.webp",
    thumb: "/photos/ie-rain-road-thumb.webp",
    width: 1280,
    height: 720,
    place: "IRELAND · 2023",
    title: "The road in the rain",
    alt: "A wet country lane past white cottages under a grey sky",
  },
  {
    id: "vn-pavilion-after-rain",
    src: "/photos/vn-pavilion-after-rain.webp",
    thumb: "/photos/vn-pavilion-after-rain-thumb.webp",
    width: 2048,
    height: 1365,
    place: "VIETNAM · 2020",
    title: "After the rain",
    alt: "A tiled pavilion reflected in a flooded courtyard, limestone hills behind",
  },
  {
    id: "tw-cat-mist-mountain",
    src: "/photos/tw-cat-mist-mountain.webp",
    thumb: "/photos/tw-cat-mist-mountain-thumb.webp",
    width: 2400,
    height: 1200,
    place: "TAIWAN · 2023",
    title: "Watcher in the mist",
    alt: "A black cat peeks over a rooftop edge beneath a mist-covered mountain",
  },
  {
    id: "br-museum-window",
    src: "/photos/br-museum-window.webp",
    thumb: "/photos/br-museum-window-thumb.webp",
    width: 1280,
    height: 719,
    place: "BRAZIL · 2024",
    title: "Two at the window",
    alt: "Two people in silhouette, seen from behind, sit at a tall glass wall facing palm trees",
  },
  {
    id: "cz-prague-weir",
    src: "/photos/cz-prague-weir.webp",
    thumb: "/photos/cz-prague-weir-thumb.webp",
    width: 1280,
    height: 720,
    place: "CZECHIA · 2023",
    title: "The weir below Petřín",
    alt: "The Vltava weir under a cloudy sky, a wooded hill with a lookout tower behind",
    shot: {
      webm: "/photos/shots/cz-prague-weir.webm",
      mp4: "/photos/shots/cz-prague-weir.mp4",
      webmBytes: 1204224,
      mp4Bytes: 1341304,
      soundSource: "LTX 2.5",
      subject: "a wide shot from the embankment, a little above a broad river, on an overcast afternoon. In the middle of the frame a low weir curves diagonally toward the lower right, the river spilling over its edge in a long white curl. Still, dark water in the left foreground mirrors the trees and sky. On the far bank a white building sits below a wooded hill, and a slender lookout tower rises on the hilltop at the right.",
      whatHappens: "The river slides smooth and glassy up to the weir’s lip, then tips over and breaks into tumbling white foam, churning at the foot of the step and spreading downstream in streaks and eddies. Spray lifts in a faint mist along the whole curve. A small branch drifts on the smooth water, reaches the lip, and is swept over and gone. Above, soft grey clouds drift slowly to the left.",
      camera: "The camera remains static.",
      sound: "the weir’s steady roar close by, the hiss of spray, the river lapping the embankment below, and a gull calling once overhead.",
    },
  },
];
