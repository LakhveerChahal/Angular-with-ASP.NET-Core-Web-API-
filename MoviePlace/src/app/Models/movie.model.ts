import { Genre } from './genre.model';

export interface Movie{
    movieId: string;
    movieName: string;
    movieGenres: string[];
    moviePrice: number;
    url: string;
}