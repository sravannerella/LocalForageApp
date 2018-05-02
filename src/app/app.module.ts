import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgForageModule, NgForage, NgForageCache } from 'ngforage';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    NgForageModule.forRoot()
  ],
  providers: [NgForage, NgForageCache],
  bootstrap: [AppComponent]
})
export class AppModule { }
