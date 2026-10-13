export type Photo = {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  place: string;
  title: string;
  alt: string;
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
];
