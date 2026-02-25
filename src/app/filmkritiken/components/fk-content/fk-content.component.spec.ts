import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FkContentComponent } from './fk-content.component';

xdescribe('FkContentComponent', () => {
  let component: FkContentComponent;
  let fixture: ComponentFixture<FkContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FkContentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
