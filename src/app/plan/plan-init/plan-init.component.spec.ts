import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanInitComponent } from './plan-init.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

describe('PlanInitComponent', () => {
  let component: PlanInitComponent;
  let fixture: ComponentFixture<PlanInitComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanInitComponent, RouterTestingModule.withRoutes([
        { path: 'plan/select', component: PlanInitComponent }
      ])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanInitComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/plan/select" when the button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('.continue-button')).nativeElement;
    button.click(); // Simulate the button click
    await fixture.whenStable(); // Wait for async tasks to complete

    expect(location.path()).toBe('/plan/select'); // Check the path change
  });
});
