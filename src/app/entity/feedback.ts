export class Feedback {
    id!: number;
    name!: string;
    createdDate!: Date;
    text!:string;
    number!:number;

    constructor(feedback: any) {
        this.id = feedback.id;
        this.name = feedback.name;
        this.createdDate = feedback.createdDate;
        this.text = feedback.text;
        this.number = feedback.number;
    }
}