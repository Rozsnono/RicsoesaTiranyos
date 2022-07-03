import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackInTimeComponent } from './back-in-time.component';

describe('BackInTimeComponent', () => {
  let component: BackInTimeComponent;
  let fixture: ComponentFixture<BackInTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackInTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackInTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
