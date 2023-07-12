import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { User } from "./entity/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {

    constructor(private httpClient: HttpClient,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.isUserLoggedIn()) {
            return true;
        }
        this.router.navigate(['']);
        return false;
    }

    isUserLoggedIn() {
        let user = JSON.parse(sessionStorage.getItem('user')!);
        return !(user === null);
    }

    logOut() {
        sessionStorage.removeItem('user');
        location.href = "";
    }

    static getCurrentUser() {
        let userStr = sessionStorage.getItem('user');
        if (userStr != null) {
            return new User(JSON.parse(userStr));
        } else {
            return null;
        }
    }

    static getJwtHeaderJSON() {
        return { headers: { 'Content-Type': 'application/json' } };
    }
}