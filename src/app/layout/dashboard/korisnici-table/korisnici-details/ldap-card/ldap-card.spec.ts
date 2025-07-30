import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapCard } from './ldap-card';

describe('LdapCard', () => {
  let component: LdapCard;
  let fixture: ComponentFixture<LdapCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdapCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdapCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
