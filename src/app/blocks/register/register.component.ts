import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/entity/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent implements OnInit {
  
  @Input() user: User = new User({});
  createdRoleUser: boolean = true;

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    HeaderComponent.title = "МыВместе";
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/menu']);
    }
  }

  register() {
    let passwordAccept = document.getElementById('passwordAccept') as HTMLInputElement;
    if (this.user.name == null || this.user.name.trim().length == 0) {alert('Заполните поле "Имя"');return;}
    if (this.user.phone == null || this.user.phone.trim().length == 0) {alert('Заполните поле "Номер телефона"');return;}
    if (this.user.address == null || this.user.address.trim().length == 0) {alert('Заполните поле "Адрес"');return;}
    if (this.user.about == null || this.user.about.trim().length == 0) {alert('Заполните поле "О себе"');return;}
    if (this.user.email == null || this.user.email.trim().length == 0) {alert('Заполните поле "Электронная почта"');return;}
    if (this.user.password == null || this.user.password.trim().length == 0) {alert('Заполните поле "Пароль"');return;}
    if (this.user.password.trim().length < 8 || this.user.password.trim().length > 16) {alert('Длина пароля от 8 до 16 символов');return;}
    if (passwordAccept == null || this.user.password.trim() != passwordAccept.value) {alert('Пароли должны совпадать');return;}
    
    this.http.post<any>(API_URL + '/users/register', this.user)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }

  handleError(error : HttpErrorResponse) {
  }

  process() {
    this.router.navigate(['/']);
  }

  changeGroup() {
    this.createdRoleUser = !this.createdRoleUser;
  }
}
