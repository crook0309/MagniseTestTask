import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoinService } from './shared/services/coin.service';
import { HttpClientModule } from '@angular/common/http';
import { CryptoCurrencyComponent } from './layout/components/crypto-currency/crypto-currency.component';
import { PageWrapperComponent } from './layout/containers/page-wrapper/page-wrapper.component';
import { ChartComponent } from './layout/components/chart/chart.component';
import { SocketClientService } from './shared/services/socket-client.service';
import { ChartModule } from 'angular2-chartjs';

@NgModule({
    declarations: [
        AppComponent,
        CryptoCurrencyComponent,
        PageWrapperComponent,
        ChartComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ChartModule,
    ],
    providers: [
        CoinService,
        SocketClientService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

