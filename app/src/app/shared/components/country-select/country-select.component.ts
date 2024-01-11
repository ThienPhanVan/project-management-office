import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ICountry } from 'src/app/interface/country.interface';

@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
})
export class CountrySelectComponent implements OnInit, OnChanges {
  @Input() selectedCountry: ICountry = {} as ICountry;
  @Input() countries: ICountry[] = [];

  @Input() isOpen: boolean = false;

  @Output() selectionChange = new EventEmitter<ICountry>();

  countriesFiltered: ICountry[];

  constructor() {
    this.countriesFiltered = this.countries;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // countries changed
    let currentCountries = changes['countries']?.currentValue;
    if (currentCountries && currentCountries.length) {
      this.countriesFiltered = currentCountries;
    }
  }

  ngOnInit() {}

  cancel() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  isChecked(country: ICountry) {
    return this.selectedCountry.id === country.id;
  }

  checkboxChange(country: any) {
    if (country.id !== this.selectedCountry.id) {
      this.selectedCountry = country;
      this.selectionChange.emit(country);
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
      this.countriesFiltered = [...this.countries];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.countriesFiltered = this.countries.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  trackItems(index: number, item: ICountry) {
    return item.id;
  }
}
