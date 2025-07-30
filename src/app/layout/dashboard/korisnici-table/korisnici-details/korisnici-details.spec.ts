import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisniciDetails } from './korisnici-details';

describe('KorisniciDetails', () => {
  let component: KorisniciDetails;
  let fixture: ComponentFixture<KorisniciDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisniciDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisniciDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
