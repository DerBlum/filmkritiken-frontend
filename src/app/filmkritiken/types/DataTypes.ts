export interface Film {
  titel: string;
  details: Filmdetails;
  image: ImageData;
};

export interface Filmdetails {
  originaltitel: string;
  produktionsland: string;
  originalsprache: string;
  erscheinungsjahr: Date;
  laenge: number;
  altersfreigabe: number;
  regie: string;
};

export interface Filmbewertungen {
  film: Film;
  filmbewertungDetails: FilmbewertungDetails;
  bewertungen: Array<Bewertung>;
};

export interface FilmbewertungDetails {
  besprochenam: Date;
  beitragvon: string;
}

export interface Bewertung {
  von: string;
  wertung: number;
};

export interface ImageData {
  source: string;
  copyright: string;
};
