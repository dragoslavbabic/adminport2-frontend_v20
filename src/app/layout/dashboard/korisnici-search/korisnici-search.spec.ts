import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisniciSearch } from './korisnici-search';

describe('KorisniciSearch', () => {
  let component: KorisniciSearch;
  let fixture: ComponentFixture<KorisniciSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisniciSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisniciSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
