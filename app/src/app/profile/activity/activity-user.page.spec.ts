import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivityUserPage } from './activity-user.page';

describe('ActivityUserPage', () => {
  let component: ActivityUserPage;
  let fixture: ComponentFixture<ActivityUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivityUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
