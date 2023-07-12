export class Ticket {
    id!: number;
    name!: string;
    surname!: string;
    phone!: string;
    text!: string;
    kind!: number;
    status!: number;
    createdDate!: Date;
    changedUserId!: number;
    changedDate!: Date;
    comment!: string;

    constructor(ticket: any) {
        this.id = ticket.id;
        this.name = ticket.name;
        this.surname = ticket.surname;
        this.phone = ticket.phone;
        this.text = ticket.text;
        this.kind = ticket.kind;
        this.status = ticket.status;
        this.createdDate = ticket.createdDate;
        this.changedUserId = ticket.changedUserId;
        this.changedDate = ticket.changedDate;
        this.comment = ticket.comment;
    }
}