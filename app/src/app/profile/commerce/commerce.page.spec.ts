import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercePage } from './commerce.page';

describe('CommercePage', () => {
  let component: CommercePage;
  let fixture: ComponentFixture<CommercePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommercePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
