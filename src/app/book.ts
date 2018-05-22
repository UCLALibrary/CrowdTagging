export interface Publisher {
    city: string;
    company: string;
    country: string;
    year: number;
    votes: number;
}

export interface PublisherCity {
  id: string;
  city: string;
  votes: number;
}

export interface PublisherCompany {
  id: string;
  company: string;
  votes: number;
}

export interface PublisherCountry {
  id: string;
  country: string;
  votes: number;
}

export interface PublisherYear {
  id: string;
  year: string;
  votes: number;
}

export interface Title {
    id: string;
    name: string;
    votes: number;
}

export interface Author {
    first_name: string;
    last_name: string;
    votes: number;
}

export interface AuthorFirstName {
  id: string;
  name: string;
  votes: number;
}

export interface AuthorLastName {
  id: string;
  name: string;
  votes: number;
}

export interface Page {
    id: string;
    number: string;
    votes: number;
}

export interface Genre {
    id: string;
    name: string;
    votes: number;
}

export interface Romanization {
    id: string;
    name: string;
    votes: number;
}

export interface Language {
  id: string;
  language: string;
  votes: number;
}

export class Book {
   image_ids: number[];
   pages: number;
}
