import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/entity/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  
  @Input() user!: User;

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    this.user = new User({});

    HeaderComponent.title = "МыВместе";
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/menu']);
    }
  }

  login() {
    if (this.user.email == null || this.user.email.trim().length == 0) {alert('Заполните поле "Электронная почта"');return;}
    if (this.user.password == null || this.user.password.trim().length == 0) {alert('Заполните поле "Пароль"');return;}
    this.http.post<any>(API_URL + '/users/login', this.user)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }

  handleError(error : HttpErrorResponse) {
    console.log("error");
    this.user.password = "";
  }

  process(user : User) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/menu']);
  }
}
