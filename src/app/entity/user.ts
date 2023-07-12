import { Role } from "./role";

export class User {
  id!: number;
  email!:string;
  name!:string;
  phone!:string;
  address!:string;
  roles!:Array<Role>;
  about!:string;
  password!:string;

  constructor(user:any){
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.address = user.address;
    this.phone = user.phone;
    this.roles = user.roles;
    this.about = user.about;
    this.password = user.password;
  }
}