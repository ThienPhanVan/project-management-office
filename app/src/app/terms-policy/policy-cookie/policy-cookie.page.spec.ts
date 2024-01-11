import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicycookiePage } from './policy-cookie.page';

describe('PolicycookiePage', () => {
  let component: PolicycookiePage;
  let fixture: ComponentFixture<PolicycookiePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PolicycookiePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
