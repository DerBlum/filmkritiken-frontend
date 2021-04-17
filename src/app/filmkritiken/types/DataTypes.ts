export interface Film {
  name: string;
  beitragvon: string;
  besprochenam: Date;
  image: ImageData;
};

export interface Bewertung {
  von: string;
  wertung: number;
};

export interface Filmbewertungen {
  film: Film;
  bewertungen: Array<Bewertung>;
};

export interface ImageData {
  source: string;
  copyright: string;
}
