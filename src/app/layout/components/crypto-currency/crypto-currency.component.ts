import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoinService } from '../../../shared/services/coin.service';
import { SocketClientService } from 'src/app/shared/services/socket-client.service';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { CoinPriceMessage } from 'src/app/shared/interfaces/coin-price-message.interface';


@Component({
  selector: 'app-crypto-currency',
  templateUrl: './crypto-currency.component.html',
  styleUrls: ['./crypto-currency.component.scss']
})
export class CryptoCurrencyComponent implements OnInit, OnDestroy {

  public listAssets = [];
  private _ngUnsubscribe = new Subject();
  public messageMarketData: CoinPriceMessage;
  public assetSelected: string;
  public form: FormGroup;

  constructor(
    private socketClientService: SocketClientService,
    private coinService: CoinService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(this.createFormGroup().controls);
    this.assetSelected = this.form.value['asset'];
    this.socketClientService.assetsSubject.pipe(takeUntil(this._ngUnsubscribe)).subscribe((assetsList: string[]) => {
      this.listAssets = assetsList;
    });
    this.socketClientService.coinMessagesSubject.pipe(takeUntil(this._ngUnsubscribe)).subscribe(messages => {
      if (!messages[this.assetSelected]) { return; }
      this.messageMarketData = messages[this.assetSelected];
      this.messageMarketData = {
        ...this.messageMarketData, time_exchange: moment(this.messageMarketData.time_exchange).format('MMM. D, h:mm A z')
      }
    });
    this.subscribeCoinSocket();
    this.getAssetHistoricalData(this.assetSelected);
  }

  get asset() { return this.form.get('asset') };

  createFormGroup() {
    return new FormGroup({
      asset: new FormControl('BTC', [Validators.required]),
    })
  }

  subscribeCoinSocket() {
    this.socketClientService.coinSubscribe();
  }

  onChangeAsset() {
    if (this.assetSelected === this.form.value['asset']) { return; }
    this.assetSelected = this.form.value['asset'];
    this.getAssetHistoricalData(this.assetSelected);
    this.subscribeCoinSocket();
  }

  getAssetHistoricalData(assetHistory) {
    let assetData = {
      asset_id_base: assetHistory,
      asset_id_quote: 'USD',
      period_id: '1DAY',
      time_start: this.setStartPeriod(),
      time_end: this.setEndPeriod(),
    };
    this.coinService.getHistoricalData(assetData).pipe(takeUntil(this._ngUnsubscribe)).subscribe((data) => {
      this.coinService.dataChartsSubject.next(data);
    })
  }

  setStartPeriod() {
    let date = new Date();
    date.setDate(date.getDate() - 10);
    return date.toISOString();
  }

  setEndPeriod() {
    let date = new Date();
    date.setDate(date.getDate() - 0);
    return date.toISOString();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}

