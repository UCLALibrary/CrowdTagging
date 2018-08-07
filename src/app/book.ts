export interface Publisher {
    city: string;
    company: string;
    country: string;
    year: number;
    votes: number;
}

export interface PublisherCity {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherCityRom {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherCompany {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherCompanyRom {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherCountry {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherCountryRom {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherYear {
  id: string;
  value: string;
  votes: number;
}

export interface PublisherYearRom {
  id: string;
  value: string;
  votes: number;
}

export interface Title {
    id: string;
    value: string;
    votes: number;
}

export interface Translation {
  id: string;
  value: string;
  votes: number;
}

export interface Script {
  id: string;
  value: string;
  votes: number;
}

export interface Author {
    first_name: string;
    last_name: string;
    votes: number;
}

export interface AuthorFirstName {
  id: string;
  value: string;
  votes: number;
}

export interface AuthorFirstNameRom {
  id: string;
  value: string;
  votes: number;
}

export interface AuthorLastName {
  id: string;
  value: string;
  votes: number;
}

export interface AuthorLastNameRom {
  id: string;
  value: string;
  votes: number;
}

export interface Page {
    id: string;
    value: string;
    votes: number;
}

export interface Romanization {
    id: string;
    value: string;
    votes: number;
}

export interface Language {
  id: string;
  value: string;
  votes: number;
}

export class Book {
   image_ids: number[];
   pages: number;
   image_key: string;
   submissions: number;
   completed: boolean;
}
