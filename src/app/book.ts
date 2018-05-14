export interface Publisher{
    city: string;
    company:string;
    country: string;
    year: number;
    votes: number;
}

export interface Title {
    id: string;
    name: string;
    votes: number;
}

export interface Author{
    first_name: string;
    last_name: string;
    votes: number;
}

export interface Page{
    id: string;
    number: string;
    votes: number;
}

export interface Genre{
    id: string;
    name: string;
    votes: number;
}

export interface Romanization{
    id: string;
    name: string;
    votes: number;
}

export class Book{
   image_ids: number[];
   pages: number;
}
