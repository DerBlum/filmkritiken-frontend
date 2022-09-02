import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkAddFilmDialogComponent } from './fk-add-film-dialog.component';

describe('FkAddFilmDialogComponent', () => {
  let component: FkAddFilmDialogComponent;
  let fixture: ComponentFixture<FkAddFilmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FkAddFilmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkAddFilmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
