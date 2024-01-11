import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitmentPage } from './commitment.page';

describe('CommitmentPage', () => {
  let component: CommitmentPage;
  let fixture: ComponentFixture<CommitmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
