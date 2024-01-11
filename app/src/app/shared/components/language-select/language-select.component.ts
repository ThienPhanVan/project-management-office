import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewsDataService } from '../../services';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
})
export class LanguageSelectComponent implements OnInit {
  @Input() languageId: string = 'vi';

  languages = [
    {
      language: 'Tiếng Việt',
      key: 'vi',
    },
    {
      language: 'English',
      key: 'en',
    },
  ];

  @Output() selectionChange = new EventEmitter<any>();

  constructor(
    private newsDataService : NewsDataService
  ) {
  }

  ngOnInit() {

  }

  ionChange() {
    const language = this.languages.find(
      (language: any) => language.key === this.languageId
    );
    this.selectionChange.emit(language);
    this.newsDataService.setMyLanguage(this.languageId)
  }
}
