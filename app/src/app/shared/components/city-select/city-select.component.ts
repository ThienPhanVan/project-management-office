import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import * as _ from 'lodash';

import { ICity } from 'src/app/interface/city.interface';
import { ICountry } from 'src/app/interface/country.interface';
import { MasterDataService } from '../../services';

@Component({
  selector: 'app-city-select',
  templateUrl: './city-select.component.html',
  styleUrls: ['./city-select.component.scss'],
})
export class CitySelectComponent implements OnInit, OnChanges {
  @Input() selectedCountryId: string = '';
  @Input() selectedCity: ICity = {} as ICountry;

  @Input() isOpen: boolean = false;

  @Output() selectionChange = new EventEmitter<ICity>();

  countries: ICountry[] = [];
  cities: ICity[] = [];
  citiesFiltered: ICity[] = [];

  constructor(private masterDataService: MasterDataService) {
    this.getCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // get cities when country changes
    let currentCountryId = changes['selectedCountryId']?.currentValue;
    if (currentCountryId && this.countries) {
      this.getCitiesByCountryId(currentCountryId);
    }
    
    // set cities value is city selected if cities empty
    let currentCity = changes['selectedCity']?.currentValue;
    if (_.includes(_.keys(currentCity), 'id') && !this.cities) {
      this.cities = [this.selectedCity];
      this.citiesFiltered = [this.selectedCity];
    }
  }

  ngOnInit() {}

  getCountries() {
    this.masterDataService.countries$.subscribe((value) => {
      this.countries = value;
      this.getCitiesByCountryId(this.selectedCountryId);
    });
  }

  getCitiesByCountryId(countryId: string) {
    const selectedCountry = _.find(
      this.countries,
      (country) => country.id === countryId
    );
    if (selectedCountry) {
      this.cities = selectedCountry.cities;
      this.citiesFiltered = this.cities;
    }
  }

  cancel() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  isChecked(value: ICity) {
    return this.selectedCity.id === value.id;
  }

  checkboxChange(city: any) {
    if (city.id !== this.selectedCity.id) {
      this.selectedCity = city;
      this.selectionChange.emit(this.selectedCity);
    }
    this.isOpen = false;
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.citiesFiltered = [...this.cities];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.citiesFiltered = this.cities.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  trackItems(index: number, item: ICity) {
    return item.id;
  }
}
