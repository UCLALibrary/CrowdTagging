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

export class Book{
   image_ids: number[];
   pages: number;
   publisher: Publisher[];
   title:  Title[];
   author: Author[];
}
