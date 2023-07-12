import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/entity/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from 'src/app/entity/ticket';
import { Feedback } from 'src/app/entity/feedback';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Stat } from 'src/app/entity/stat';
import { GroupStat } from 'src/app/entity/groupstat';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxChartsModule]
})
export class IndexComponent implements OnInit {

  @Input() user?: User | null;
  helpKind: string | undefined;
  helpKindId!: number;
  isSign: boolean = false;
  ticketTitle!: string;
  ticketSearchId!: number;

  tickets!: Ticket[];
  feedbacks!: Feedback[];
  users!: User[];

  feedback: Feedback = new Feedback({});
  ticket: Ticket = new Ticket({});
  cuser: User = new User({});

  data1!: Array<Stat>;
  data2!: Array<Stat>;
  data3!: Array<GroupStat>;
  statLabel1: string = "Статистика по статусам";
  statLabel2: string = "Статистика по видам помощи";
  statLabel3: string = "Статистика по ";

  constructor(private router: Router,
    private modalService: NgbModal,
    public authService: AuthService,
    private http: HttpClient) {

  }

  ngOnInit(): void {
    this.user = AuthService.getCurrentUser();
    this.getUsers();
    HeaderComponent.title = "МыВместе";

    this.http.get<any>(API_URL + '/ticket/stats?status=1', AuthService.getJwtHeaderJSON())
      .subscribe({
        next: this.getEvent1.bind(this)
      });
    this.http.get<any>(API_URL + '/ticket/stats?status=2', AuthService.getJwtHeaderJSON())
      .subscribe({
        next: this.getEvent2.bind(this)
      });
    this.http.get<any>(API_URL + '/ticket/stats?status=3', AuthService.getJwtHeaderJSON())
      .subscribe({
        next: this.getEvent3.bind(this)
      });
  }

  showModal(modalContent: any) {
    this.modalService.open(modalContent, { fullscreen: true, scrollable: true });
    this.http.get<any>(API_URL + '/feedback/list')
      .subscribe({
        error: this.handleError.bind(this),
        next: this.processFeedbacksList.bind(this)
      });

  }

  showModalParams(modalContent: any, param: any) {
    let modalRef = this.modalService.open(modalContent, { fullscreen: true, scrollable: true });
    this.helpKind = param;
    if (this.helpKind == 'адресную') {
      this.helpKindId = 0;
    } else if (this.helpKind == 'психологическую') {
      this.helpKindId = 1;
    } else if (this.helpKind == 'гуманитарную') {
      this.helpKindId = 2;
    } else {
      this.helpKindId = 3;
    }
  }

  showModalParams2(modalContent: any, param: any) {
    let modalRef = this.modalService.open(modalContent, { fullscreen: true, scrollable: true });
    this.ticketTitle = param;
    if (this.ticketTitle == 'Новые заявки') {
      this.ticketSearchId = 0;
    } else if (this.ticketTitle == 'Заявки в работе') {
      this.ticketSearchId = 1;
    } else if (this.ticketTitle == 'Завершенные заявки') {
      this.ticketSearchId = 2;
    } else {
      this.ticketSearchId = 3;
    }
    this.http.get<any>(API_URL + '/ticket/list?status=' + this.ticketSearchId)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.processTicketsList.bind(this)
      });
  }

  logout() {
    this.authService.logOut();
  }

  sendTicket() {
    this.ticket.status = 0;
    this.ticket.kind = this.helpKindId;
    this.http.post<any>(API_URL + '/ticket/create', this.ticket)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.process.bind(this)
      });
  }

  sendFeedback() {
    this.http.post<any>(API_URL + '/feedback/create', this.feedback)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.process.bind(this)
      });
  }

  handleError(error: HttpErrorResponse) {
  }

  process() {
    this.ticket = new Ticket({});
    this.feedback = new Feedback({});
    location.href = "";
  }

  processTicketsList(tickets: any) {
    this.tickets = tickets;
  }

  processFeedbacksList(feedbacks: any) {
    this.feedbacks = feedbacks;
  }

  openTicketModal(modalContent: any, t: any) {
    this.ticket = t;
    this.modalService.open(modalContent, { fullscreen: true, scrollable: true });
  }

  changeState(status: any) {
    this.ticket.status = status;
    this.ticket.changedUserId = this.user!.id;
    this.http.put<any>(API_URL + '/ticket/changeStatus', this.ticket)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.process.bind(this)
      });
  }

  deleteTicket(ticketId: any) {
    this.http.delete<any>(API_URL + '/ticket/delete?id=' + ticketId)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.process.bind(this)
      });
  }

  stringifyKindById(id: number) {
    if (id == 0) {
      return "Адресная помощь";
    } else if (id == 1) {
      return "Психологическая помощь";
    } else if (id == 2) {
      return "Гуманитарная помощь";
    } else {
      return "Иная помощь";
    }
  }

  stringifyStateById(id: number) {
    if (id == 0) {
      return "Новая заявка";
    } else if (id == 1) {
      return "Заявка в работе";
    } else if (id == 2) {
      return "Завершенная заявка";
    } else {
      return "Отмененная заявка";
    }
  }

  getEvent1(tasks: Array<Stat>) {
    this.data1 = tasks;
  }
  getEvent2(tasks: Array<Stat>) {
    this.data2 = tasks;
  }
  getEvent3(tasks: Array<GroupStat>) {
    this.data3 = tasks;
    console.log(this.data3);
  }

  getUsers() {
    let req = '/users/users';
    this.http.get<any>(API_URL + req)
    .subscribe({
      error: this.handleError2.bind(this),
      next: this.process2.bind(this)
    });
  }

  handleError2(error : HttpErrorResponse) {
    console.log("error");
  }

  process2(users : Array<User>) {
    this.users = users;
  }

  update() {
    if (this.cuser.id) {
      this.http.put<any>(API_URL + '/users/update', this.cuser)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.process.bind(this)
      });
    } else {
      this.http.post<any>(API_URL + '/users/register', this.cuser)
      .subscribe({
        error: this.handleError.bind(this),
        next: this.process.bind(this)
      });
    }
  }

  setCuser(setCuser: User) {
    this.cuser = setCuser;
  }

  showModalUser(modalContent: any, cuser?: User) {
    this.getUsers();
    if (cuser) {
      this.setCuser(cuser);
    } else {
      this.setCuser(new User({}))
    }
    this.modalService.open(modalContent, { fullscreen: true, scrollable: true });
  }

  deleteUser(id: number) {
    this.http.delete<any>(API_URL + '/users/delete?id=' + id)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }

  grantUser(id: number) {
    this.http.get<any>(API_URL + '/users/grant?id=' + id)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }

  degrantUser(id: number) {
    this.http.get<any>(API_URL + '/users/degrant?id=' + id)
    .subscribe({
      error: this.handleError.bind(this),
      next: this.process.bind(this)
    });
  }
}
