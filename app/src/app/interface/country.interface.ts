import { ICity } from './city.interface';

export interface ICountryCreate {
  name: string;
  description: string;
  type: string;
  parent_id: string;
  display_order: number;
}

export interface ICountries {
  data: ICountry[];
  paging: {
    count: number;
    litmit: number;
    offset: number;
  };
}

export interface ICountry {
  id: string;
  name: string;
  description: string;
  display_order: number;
  code: number;
  cities: ICity[];
}
