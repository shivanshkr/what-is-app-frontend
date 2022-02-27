import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({});
  showPassword = false;
  type = 'password';
  errMsg: any = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  login() {
    this.errMsg = null;
    this.isLoading = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;

      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: `Login successful`,
        });
        localStorage.setItem('whatIsAppToken', res?.token);
        localStorage.setItem('id', res?.id);
        this.isLoading = false;
        this.router.navigate(['/chat']);
      },
      (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: err.error,
        });
        this.errMsg = err.error;
        this.isLoading = false;
      }
    );

    console.log(this.loginForm);
  }
  changeShowPassword(value: boolean) {
    console.log(value);
    this.showPassword = value;
    if (value) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
