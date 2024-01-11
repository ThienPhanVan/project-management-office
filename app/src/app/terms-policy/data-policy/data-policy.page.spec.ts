import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPolicyPage } from './data-policy.page';

describe('DataPolicyPage', () => {
  let component: DataPolicyPage;
  let fixture: ComponentFixture<DataPolicyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
