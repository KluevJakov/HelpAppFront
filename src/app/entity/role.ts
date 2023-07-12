export class Role {
    id!: number;
    displayName!: string;
    name!: string;

    constructor(role: any) {
        this.id = role.id;
        this.displayName = role.displayName;
        this.name = role.name;
    }
}