import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPastComponent } from './admin-past.component';

describe('AdminPastComponent', () => {
  let component: AdminPastComponent;
  let fixture: ComponentFixture<AdminPastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
