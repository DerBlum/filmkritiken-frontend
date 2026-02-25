import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkTableComponent } from './fk-table.component';

xdescribe('FkTableComponent', () => {
  let component: FkTableComponent;
  let fixture: ComponentFixture<FkTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FkTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
