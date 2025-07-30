import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisniciTable } from './korisnici-table';

describe('KorisniciTable', () => {
  let component: KorisniciTable;
  let fixture: ComponentFixture<KorisniciTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisniciTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisniciTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
