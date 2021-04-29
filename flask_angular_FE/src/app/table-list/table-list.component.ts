import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Client} from '../Model/Client';
import {CdkTableModule} from '@angular/cdk/table';
import {log} from 'util';
import {NotificationsComponent} from '../notifications/notifications.component'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

export interface UserData {
    id: string;
    name: string;
    progress: string;
    color: string;
}


@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.css'],
})


export class TableListComponent implements AfterViewInit {

    public url_get: string = 'http://127.0.0.1:5000/dashboard';
    public url_search: string = 'http://127.0.0.1:5000/dashboard/search';
    public url_insert: string = 'http://127.0.0.1:5000/dashboard/insert';
    public url_delete: string = 'http://127.0.0.1:5000/dashboard/delete';
    public url_edit: string = 'http://127.0.0.1:5000/dashboard/edit';
    public author_key_demo: string = 'AuthorizationKeyDemoOfProject123';
    dataSource: MatTableDataSource<Client>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    first_name: string = '';
    last_name: string = '';
    age: string = '';
    address: string = '';
    email: string = '';
    employer: string = '';
    balance: string = '';
    isLoading: boolean = true;
    selectedRowIndex = -1;
    row_selected = null;
    columns: Array<any> = [
        {name: 'firstname', label: 'First Name', cell: (element: any) => `${element.firstname}`},
        {name: 'lastname', label: 'Last Name', cell: (element: any) => `${element.lastname}`},
        {name: 'age', label: 'Age', cell: (element: any) => `${element.age}`},
        {name: 'address', label: 'Address', cell: (element: any) => `${element.address}`},
        {name: 'email', label: 'Email', cell: (element: any) => `${element.email}`},
        {name: 'employer', label: 'Employer', cell: (element: any) => `${element.employer}`},
        {name: 'balance', label: 'Balance', cell: (element: any) => `${element.balance}`},
    ]
    displayedColumns = this.columns.map(c => c.name);

    notificationCmp: any;
    closeResult: string;

    obj_edit_client: any = {
        first_name: '',
        last_name: '',
        age: '',
        address: '',
        email: '',
        employer: '',
        balance: '',
    }
    reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.author_key_demo
    });
    constructor(private httpClient: HttpClient, private modalService: NgbModal) {


    }

    getClientData() {

        return this.httpClient.post(this.url_get, null, {headers: this.reqHeader}).subscribe(response => {
            // this.dataSource = data['result'];
            // Assign the data to the data source for the table to render
            console.log("resssss", response);
            if (response['result'] !== 999){
                this.dataSource = new MatTableDataSource(response['result']);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            else {
                this.notificationCmp.showNotification('Authentication failed', 'warning');
            }

            this.isLoading = false;
        }, error => this.isLoading = false);
    }


    ngAfterViewInit() {

        console.log('after view init');
        this.getClientData();
        this.notificationCmp = new NotificationsComponent()

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    handleSearch() {
        this.isLoading = true;
        let search_param: any = {
            'firstname': this.first_name,
            'lastname': this.last_name,
            'age': this.age,
            'address': this.address,
            'email': this.email,
            'employer': this.employer,
            'balance': this.balance,
        }
        return this.httpClient.post(this.url_search, search_param, {headers: this.reqHeader}).subscribe(response => {
            // this.dataSource = data['result'];
            // Assign the data to the data source for the table to render
            if (response['result'] !== 999){
                this.dataSource = new MatTableDataSource(response['result']);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            else {
                this.notificationCmp.showNotification('Authentication failed', 'warning');
            }

            this.isLoading = false;
        }, error => this.isLoading = false);

    };

    getSelectedRow(row) {
        console.log('rowwww', row);
        if (row.account_number === this.selectedRowIndex) {
            this.selectedRowIndex = -1;
            this.row_selected = null;
            return;
        }
        this.selectedRowIndex = row.account_number;
        this.row_selected = row;
    }

    handleCreateClient() {
        let insert_param: any = {
            'firstname': this.first_name,
            'lastname': this.last_name,
            'age': this.age,
            'address': this.address,
            'email': this.email,
            'employer': this.employer,
            'balance': this.balance,
        }
        if (insert_param['firstname'] === '' || insert_param['firstname'] === null) {
            this.notificationCmp.showNotification('Please input first name', 'warning');
            return;
        } else if (insert_param['lastname'] === '' || insert_param['lastname'] === null) {
            this.notificationCmp.showNotification('Please input last name', 'warning');
            return;
        } else if (insert_param['age'] === '' || insert_param['age'] === null) {
            this.notificationCmp.showNotification('Please input age', 'warning');
            return;
        } else if (insert_param['address'] === '' || insert_param['address'] === null) {
            this.notificationCmp.showNotification('Please input address', 'warning');
            return;
        }
        return this.httpClient.post(this.url_insert, insert_param,{headers: this.reqHeader}).subscribe(response => {
            // this.dataSource = data['result'];
            // Assign the data to the data source for the table to render
            if (response['code'] === 999){
                this.notificationCmp.showNotification('Authentication failed', 'warning');
            }
            else if (response['code'] === 0) {
                this.notificationCmp.showNotification('Add client successfully', 'success');
                this.getClientData();
            }
            this.isLoading = false;
        }, error => this.isLoading = false);
    }

    handleDeleteClient() {
        return this.httpClient.post(this.url_delete, this.row_selected,{headers: this.reqHeader}).subscribe(response => {
            // this.dataSource = data['result'];
            // Assign the data to the data source for the table to render
            if (response['code'] === 999){
                this.notificationCmp.showNotification('Authentication failed', 'warning');
            }
            else if (response['code'] === 0) {
                this.notificationCmp.showNotification('Delete client successfully', 'success');
                this.getClientData();
            }
            this.isLoading = false;
        }, error => this.isLoading = false);
    };

    handleOpenClientDetailModal(content) {
        this.obj_edit_client = this.row_selected;
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;

        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    };

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    };

    handleEditClient() {
        return this.httpClient.post(this.url_edit, this.row_selected,{headers: this.reqHeader}).subscribe(response => {
            // this.dataSource = data['result'];
            // Assign the data to the data source for the table to render
            if (response['code'] === 999){
                this.notificationCmp.showNotification('Authentication failed', 'warning');
            }
            else if (response['code'] === 0) {
                this.notificationCmp.showNotification('Save client successfully', 'success');
                this.getClientData();
                this.modalService.dismissAll()
            }
            this.isLoading = false;
        }, error => this.isLoading = false);
    }
}


