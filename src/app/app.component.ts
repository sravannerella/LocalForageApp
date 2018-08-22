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
    userStorage: LocalForage;
    instances: LocalForage[] = [];
    instanceNum = 0;
    driver;
    timer;
    start;
    end;
    logs = [];
    counter = 0;
    count = 0;
    records = 1000;

    constructor(private toastr: ToastrService) {

        this.instanceNum = this.instanceNum + 1;

        this.userStorage = localForage.createInstance({
            name: 'localForageDB' + this.instanceNum, // DB NAME
            storeName: 'logins', // TABLE or collection NAME
            driver: [
                localForage.WEBSQL
            ]
        });

        this.instances.push(this.userStorage);
    }

    dropDB() {
        const self = this;
        this.userStorage.clear().then(function() {
            self.toastr.success('', 'DROP DATABASE');
        });
    }

    changeDriver(driver) {
        if ( driver === 'indexed' ) {
            this.userStorage.setDriver(localForage.INDEXEDDB).then( () => {
                this.driver = this.userStorage.driver();
            } );
        } else {
            this.userStorage.setDriver(localForage.WEBSQL).then( () => {
                this.driver = this.userStorage.driver();
            } );
        }
    }

    newInstance() {
        this.instanceNum++;
        this.userStorage = localForage.createInstance({
            name: 'localForageDB' + this.instanceNum,
            storeName: 'logins',
            driver: [
                localForage.INDEXEDDB
            ]
        });
        this.instances.push(this.userStorage);
    }

    startTime() {
        this.driver = this.userStorage.driver();
        this.start = new Date();
    }

    stopTime(task) {
        this.end = new Date();
        console.log('TIME TAKEN:', (this.end - this.start) );
        this.logs.push({
            task: task,
            driver: this.userStorage.driver(),
            timeTaken: (this.end - this.start)
        });
    }

    insert() {
        this.startTime();
        while (this.count < this.records) {
            const data = {
                email: 'instance' + this.count,
                pass: 'pass' + this.count
            };
            this.userStorage.setItem('key' + this.count , data).then( (res) => {
                this.counter++;
                if (this.counter === this.records) {
                    this.stopTime('Insert');
                    this.counter = 0;
                }
            });
            this.count++;
        }
    }

    search(key) {
        this.startTime();
        this.userStorage.getItem(key).then((data) => {
            this.stopTime('Search');
            console.log(data);
        });
    }

    delete() {
        this.count = 0;
        this.startTime();
        while (this.count < this.records) {
            this.userStorage.removeItem('key' + this.count).then( (res) => {
                this.counter++;
                if (this.counter === this.records) {
                    this.stopTime('Delete');
                }
            });
            this.count++;
        }
    }

}
