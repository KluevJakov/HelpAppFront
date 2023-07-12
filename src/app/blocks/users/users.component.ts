import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/entity/user';
import { environment } from 'src/environments/environment';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  
  users!: Array<User>;

  constructor(private modalService: NgbModal, 
    private http: HttpClient,
    public activeModal: NgbActiveModal) {
    
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    let req = '/users/users';
    let searchField = document.getElementById("searchField") as HTMLInputElement;
    if (searchField.value != null && searchField.value.trim().length != 0) {
      req += "?fts="+searchField.value;
    }
    this.http.get<any>(API_URL + req)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }

  handleError(error : HttpErrorResponse) {
    console.log("error");
  }

  process(users : Array<User>) {
    this.users = users;
  }
}
