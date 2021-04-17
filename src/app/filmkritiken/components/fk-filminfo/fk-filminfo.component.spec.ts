import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkFilminfoComponent } from './fk-filminfo.component';

describe('FkFilminfoComponent', () => {
  let component: FkFilminfoComponent;
  let fixture: ComponentFixture<FkFilminfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FkFilminfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkFilminfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
