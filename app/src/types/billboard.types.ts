export interface BillboardShowtime {
  id: number;
  startTime: Date;
  endTime: Date;
  price: number;
  room: {
    id: number;
    name: string;
    type: string;
  };
  cinema: {
    id: number;
    name: string;
    address: string;
    city: string;
  };
}

export interface BillboardMovie {
  id: number;
  tmdbId?: number;
  title: string;
  synopsis?: string;
  duration?: number;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  rating?: number;
  showtimes: BillboardShowtime[];
}