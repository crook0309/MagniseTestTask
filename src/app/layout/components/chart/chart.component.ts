import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { CoinService } from 'src/app/shared/services/coin.service';
import { HistoricalPrice } from 'src/app/shared/interfaces/historical-price.interface';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() asset: string;
  private _ngUnsubscribe = new Subject();
  public type = 'line';
  public data = {};
  public options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private coinService: CoinService,
  ) { }

  ngOnInit(): void {
    this.coinService.dataChartsSubject.pipe(takeUntil(this._ngUnsubscribe)).subscribe((dataChart: HistoricalPrice[]) => {
      if (!dataChart) { return; }
      this.data = {
        labels: this.setData(dataChart)?.labels,
        datasets: [
          {
            label: "Historical price",
            data: this.setData(dataChart)?.datasets
          }
        ]
      };
    })
  }
  setData(dataChart: HistoricalPrice[]) {
    if (dataChart.length === 0) { return; }
    let chartData = { labels: [], datasets: [] };
    dataChart.forEach((item: HistoricalPrice) => {
      chartData = {
        ...chartData, labels: [...chartData.labels, moment(item.time_close).format('L')],
        datasets: [...chartData.datasets, item['rate_close']]
      }
    });
    return chartData;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
