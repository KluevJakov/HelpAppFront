import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/entity/user';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  @Input() user!: User;

  constructor(public activeModal: NgbActiveModal,
    private http: HttpClient,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  update() {
    this.http.post<any>(API_URL + '/users/update', this.user)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }

  handleError(error : HttpErrorResponse) {
    console.log("error");
  }

  process(user : User) {
    this.activeModal.close();
  }

  getCurrentUser() {
    this.http.get<any>(API_URL + '/users?id='+AuthService.getCurrentUser()!.id)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process2.bind(this)
    });
  }

  process2(user : User) {
    this.user = user;
  }
}
