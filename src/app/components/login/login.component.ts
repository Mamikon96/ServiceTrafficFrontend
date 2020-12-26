import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public _title: string = "Login Page";
    public _form: FormGroup;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private http: HttpClient,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        if (sessionStorage.getItem('token')) {
            this.router.navigate(['/home']);
        } else {
            sessionStorage.setItem('token', '');
            this.initForm();
        }
    }

    login() {
        let url = 'http://localhost:8080/login';
        let user: User = this.getFormData();

        this.http.post<Observable<boolean>>(url, user)
        .subscribe(isValid => {
            if (isValid) {
                sessionStorage.setItem(
                    'token',
                    btoa(user.username + ':' + user.password)
                );
                this.router.navigate(['/home']);
            } else {
                alert("Authentication failed.")
            }
        });
    }

    private initForm(): void {
        this._form = this.fb.group({
            username: ['', []],
            password: ['', []]
        });
    }

    private getFormData(): User {
        return {
            username: this._form.get("username").value,
            password: this._form.get("password").value
        };
    }
}


interface User {
    username: string;
    password: string;
}
