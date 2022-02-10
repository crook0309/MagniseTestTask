import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../../src/environments/environment'
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HistoricalPrice } from '../interfaces/historical-price.interface';

@Injectable()

export class CoinService {
    public apiUrl = environment.apiUrl;
    private apiKey = 'B25E50FD-48BF-4138-84D0-813FBA2D7FF0';
    public dataChartsSubject = new BehaviorSubject<HistoricalPrice[]>([]);

    constructor(
        private http: HttpClient,
    ) { }

    getHistoricalData(data): Observable<HistoricalPrice[]> {
        return this.http.get<HistoricalPrice[]>(
            `${ this.apiUrl }/v1/exchangerate/${ data.asset_id_base }/${ data.asset_id_quote }/history?period_id=${ data.period_id }&time_start=${ data.time_start }&time_end=${ data.time_end }`, { headers: { "X-CoinAPI-Key": this.apiKey } }
        )
            .pipe(
                catchError((error) => {
                    return throwError(error);
                })
            );
    }
}







