import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as localForage from 'localforage';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    myForm: FormGroup;
    email: FormControl;
    password: FormControl;
    dataJSON = {};
    names: String[] = [];

    userStorage: LocalForage;
    instances: LocalForage[] = [];
    data: string[] = [];
    instanceNum = 0;

    constructor(private toastr: ToastrService) {

        this.instanceNum = this.instanceNum + 1;

        this.userStorage = localForage.createInstance({
            name: 'localForageDB' + this.instanceNum, // DB NAME
            storeName: 'logins', // TABLE or collection NAME
            driver: [
                localForage.INDEXEDDB,
                localForage.WEBSQL,
                localForage.LOCALSTORAGE
            ]
        });

        this.instances.push(this.userStorage);

        this.initializeFormControls();
        this.initForm();
    }

    initializeFormControls() {
        this.email = new FormControl('', [Validators.required, Validators.pattern('[^ @]*@[^ @]*')]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(4)]);
    }

    initForm() {
        this.myForm = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    dropDB() {
        const self = this;
        this.userStorage.clear().then(function() {
            self.toastr.success('', 'DROP DATABASE');
        });
    }

    newInstance() {
        this.instanceNum++;
        this.userStorage = localForage.createInstance({
            name: 'localForageDB' + this.instanceNum,
            storeName: 'logins',
            driver: [
                localForage.INDEXEDDB,
                localForage.WEBSQL,
                localForage.LOCALSTORAGE
            ]
        });
        this.instances.push(this.userStorage);
    }

    showInstances() {
        this.instances.map( (instance) => {
            if (this.names.indexOf(instance.config().name) === -1 ) {
                this.names.push(instance.config().name);
                instance.getItem('key').then( (data: string) => {
                    this.data.push(JSON.parse(data));
                });
            }
        });
    }

    getDataFromDB() {
        const self = this;
        this.userStorage.getItem('key').then( (newData) => {
            self.dataJSON = JSON.parse(JSON.stringify(newData));
        }, (err) => {
            console.error('ERROR: ', err);
        });
    }

    formSubmit() {
        if (this.myForm.valid) {
            console.log('Valid');
            const data = {'email': this.email.value, 'pass': this.password.value};
            this.userStorage.setItem('key', JSON.stringify(data));
            console.log(localForage.driver());
            this.toastr.success('', 'Submitted');
        } else {
            this.toastr.error('', 'Invalid FORM');
        }
        this.myForm.reset();
    }


}
