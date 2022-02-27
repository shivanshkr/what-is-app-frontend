import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({});
  showPassword = false;
  type = 'password';
  showPassword2 = false;
  type2 = 'password';
  isUploading = false;
  errMsg: any = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initSignupForm();
  }
  initSignupForm() {
    this.signupForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      // confirmPassword: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  signup() {
    this.errMsg = null;
    this.isLoading = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    this.authService.signup(this.signupForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: `Sign Up successful`,
        });
        localStorage.setItem('whatIsAppToken', res?.token);
        localStorage.setItem('id', res?.id);
        this.isLoading = false;
        this.router.navigate(['/chat']);
      },
      (err) => {
        console.log(err.error);
        this.messageService.add({
          severity: 'error',
          summary: err.error,
        });
        this.errMsg = err.error;
        this.isLoading = false;
      }
    );
    console.log(this.signupForm);
  }

  changeShowPassword(value: boolean) {
    if (value) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  changeShowPassword2(value: boolean) {
    this.showPassword = value;
    if (value) {
      this.type2 = 'text';
    } else {
      this.type2 = 'password';
    }
  }
  onImageUpload(event: any) {
    this.isUploading = true;
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'what-is-app');
      data.append('cloud_name', 'what-is-app');
      fetch('https://api.cloudinary.com/v1_1/what-is-app/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          this.signupForm.addControl('pic', new FormControl(''));
          this.signupForm.controls.pic.setValue(data.secure_url);
          this.messageService.add({
            severity: 'success',
            summary: 'File uploaded successfully',
          });
          this.isUploading = false;
        })
        .catch((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'File not uploaded',
          });
        });
    } else this.isUploading = false;
  }
}
