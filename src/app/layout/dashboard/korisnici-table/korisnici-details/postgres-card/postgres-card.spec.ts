import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgresCard } from './postgres-card';

describe('PostgresCard', () => {
  let component: PostgresCard;
  let fixture: ComponentFixture<PostgresCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostgresCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostgresCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
