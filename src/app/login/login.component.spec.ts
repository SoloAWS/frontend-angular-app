import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
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
    const passwordInput = fixture.debugElement.query(
      By.css('input[type="password"]')
    );
    expect(passwordInput).toBeTruthy();
  });

  it('should have a login button', () => {
    const loginButton = fixture.debugElement.query(By.css('button'));
    expect(loginButton.nativeElement.textContent).toContain('INICIAR SESION');
  });

  it('should have a link to sign up', () => {
    const signUpLink = fixture.debugElement.query(
      By.css('a[routerlink="/signup"]')
    );
    expect(signUpLink.nativeElement.textContent).toContain('Crear Cuenta');
  });

  it('should have a link for forgotten password', () => {
    const forgotPasswordLink = fixture.debugElement.query(
      By.css('a:not([routerlink])')
    );
    expect(forgotPasswordLink.nativeElement.textContent).toContain(
      'Olvide mi contraseña'
    );
  });

  // New Tests
  it('should call onSubmit when the form is valid', () => {
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    component.loginForm.setValue({ username: 'test@example.com', password: 'Password123' });
    const loginButton = fixture.debugElement.query(By.css('button')).nativeElement;
    loginButton.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should display error message for invalid form fields', () => {
    component.loginForm.controls['username'].setValue('');
    expect(component.getErrorMessage('username')).toBe('Este campo es requerido');
    component.loginForm.controls['username'].setValue('invalid-email');
    expect(component.getErrorMessage('username')).toBe('Ingrese un correo electrónico válido');
    component.loginForm.controls['password'].setValue('');
    expect(component.getErrorMessage('password')).toBe('Este campo es requerido');
    component.loginForm.controls['password'].setValue('short');
    expect(component.getErrorMessage('password')).toBe('Mínimo 8 caracteres');
  });

  it('should show error message on failed login with 401', () => {
    spyOn(authService, 'login').and.returnValue(
      throwError({ status: 401 })
    );
    component.loginForm.setValue({ username: 'test@example.com', password: 'Password123' });
    component.onSubmit();
    expect(component.loginError).toBe('Usuario o contraseña incorrectos');
  });

  it('should show generic error message on failed login with other errors', () => {
    spyOn(authService, 'login').and.returnValue(
      throwError({ status: 500 })
    );
    component.loginForm.setValue({ username: 'test@example.com', password: 'Password123' });
    component.onSubmit();
    expect(component.loginError).toBe('Ha ocurrido un error. Por favor intente nuevamente.');
  });
});
