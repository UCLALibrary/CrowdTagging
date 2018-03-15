export interface Publisher{
    city: string;
    company:string;
    country: string;
    year: number;
    votes: number;
}

export interface Title{
    name: string;
    votes: number;
}

export interface Author{
    first_name: string;
    last_name: string;
    votes: number;
}

export interface Page{
    number: number;
    votes: number;
}

export interface Genre{
    name: string;
    votes: number;
}

export interface Romanization{
    name: string;
    votes: number;
}

export class Book{
   image_ids: number[];
   pages: number;
}
