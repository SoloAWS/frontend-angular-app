import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a welcome message', () => {
    const welcomeElement = fixture.debugElement.query(By.css('h1'));
    expect(welcomeElement.nativeElement.textContent).toContain('ABCalls');
  });

  it('should have a password input field', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  it('should have a login button', () => {
    const loginButton = fixture.debugElement.query(By.css('button'));
    expect(loginButton.nativeElement.textContent).toContain('INICIAR SESION');
  });

  it('should have a link to sign up', () => {
    const signUpLink = fixture.debugElement.query(By.css('a[routerlink="/signup"]'));
    expect(signUpLink.nativeElement.textContent).toContain('Crear Cuenta');
  });

  it('should have a link for forgotten password', () => {
    const forgotPasswordLink = fixture.debugElement.query(By.css('a:not([routerlink])'));
    expect(forgotPasswordLink.nativeElement.textContent).toContain('Olvide mi contraseña');
  });
});
