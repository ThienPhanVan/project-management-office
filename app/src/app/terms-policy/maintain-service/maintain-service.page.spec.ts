import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintainServicePage } from './maintain-service.page';

describe('MaintainServicePage', () => {
  let component: MaintainServicePage;
  let fixture: ComponentFixture<MaintainServicePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MaintainServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
