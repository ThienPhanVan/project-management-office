import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalRegulationsPage } from './additional-regulations.page';

describe('AdditionalRegulationsPage', () => {
  let component: AdditionalRegulationsPage;
  let fixture: ComponentFixture<AdditionalRegulationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdditionalRegulationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
