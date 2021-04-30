import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import {log} from 'util';
import {NotificationsComponent} from '../notifications/notifications.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public url_login: string = 'http://127.0.0.1:5000/login';
  notificationCmp: any;
  obj_login: any = {
    email: 'daleadams@boink.com',
    balance: '4180'
  }

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.notificationCmp = new NotificationsComponent()
  }

  handleLogin(){
    console.log("balance", this.obj_login['balance']);
    if (this.obj_login['email'] === '' || this.obj_login['email'] === null ){
      this.notificationCmp.showNotification('Please input email', 'warning');
      return;
    }
    else if (this.obj_login['balance'] === '' || this.obj_login['balance'] === null ){
      this.notificationCmp.showNotification('Please input balance', 'warning');
      return;
    }
    else if (/[a-zA-Z]/g.test(this.obj_login['balance'])) {
      console.log("balance test", /[a-zA-Z]/g.test(this.obj_login['balance']));
      this.notificationCmp.showNotification('Balance must be number only', 'warning');
      return;
    }
    else {
      // this.obj_login.balance = this.obj_login.balance.replace(/[^0-9]/g,'');
      return this.httpClient.post(this.url_login, this.obj_login).subscribe(data => {

        // Assign the data to the data source for the table to render
        console.log("response", data);
        if (data['result'] === 0){
          this.router.navigate(['/table-list']);
        }
        else {
          this.notificationCmp.showNotification('Wrong email and balance', 'warning');
        }
      }, error => console.log(error));
    }


  }
}
