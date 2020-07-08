import { Genre } from './genre.model';

export interface Movie{
    movieId: string;
    movieName: string;
    moviePrice: number;
    genres: Genre[];
    url: string;
}