import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkAccordionComponent } from './fk-accordion.component';

xdescribe('FkAccordionComponent', () => {
  let component: FkAccordionComponent;
  let fixture: ComponentFixture<FkAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FkAccordionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
