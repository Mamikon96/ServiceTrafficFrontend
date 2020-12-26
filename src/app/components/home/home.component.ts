import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'web-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private http: HttpClient,
                private router: Router,) {
    }

    ngOnInit(): void {
        let url = 'http://localhost:8080/user';

        let headers: HttpHeaders = new HttpHeaders({
            'Authorization': 'Basic ' + sessionStorage.getItem('token'),
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Origin': '*'
        });

        // headers.append('Access-Control-Allow-Headers', 'Content-Type');
        // headers.append('Access-Control-Allow-Methods', 'GET');
        // headers.append('Access-Control-Allow-Origin', '*');

        /*let options = { headers: headers };
        this.http.post<Observable<Object>>(url, {}, options).
        subscribe(principal => {
                this.username = principal['name'];
            },
            error => {
                if(error.status == 401)
                    alert('Unauthorized');
            }
        );*/

        if (!sessionStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
    }

}
