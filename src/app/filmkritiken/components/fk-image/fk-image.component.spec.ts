import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkImageComponent } from './fk-image.component';

describe('FkImageComponent', () => {
  let component: FkImageComponent;
  let fixture: ComponentFixture<FkImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FkImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
