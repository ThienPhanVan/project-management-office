import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesProvidePage } from './services-provide.page';

describe('ServicesProvidePage', () => {
  let component: ServicesProvidePage;
  let fixture: ComponentFixture<ServicesProvidePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesProvidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
