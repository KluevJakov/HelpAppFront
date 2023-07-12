import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/entity/user';
import { environment } from 'src/environments/environment';
import { ChatComponent } from '../chat/chat.component';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DoctorsComponent implements OnInit {
  
  doctors!: Array<User>;

  constructor(private modalService: NgbModal, 
    private http: HttpClient,
    public activeModal: NgbActiveModal) {
    
  }

  ngOnInit(): void {
    this.getDoctors();
  }

  chat(user : User) {
    const currentModal = this.modalService.open(ChatComponent, {fullscreen: true, scrollable: true, windowClass: 'chatModal'});
    currentModal.componentInstance.isInit = true;
    let userArr = [];
    userArr.push(user);
    currentModal.componentInstance.forUser = userArr;
    this.activeModal.close();
  }

  getDoctors() {
    let req = '/users/doctors';
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

  process(doctors : Array<User>) {
    this.doctors = doctors;
  }
}
