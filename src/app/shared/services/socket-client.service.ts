import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService implements OnDestroy {

  public listAssets = ['BTC', 'ETH', 'XLM', 'XRP', 'ADA']
  private apiKey = 'B25E50FD-48BF-4138-84D0-813FBA2D7FF0';
  public socket: any;
  public assetsSubject = new BehaviorSubject<string[]>(this.listAssets);
  public coinMessagesSubject = new BehaviorSubject<object>(this.setInitialMessages());

  constructor() { }
  coinSubscribe() {
    let body = {
      "type": "hello",
      "apikey": this.apiKey,
      "heartbeat": false,
      "subscribe_data_type": ["trade"],
      "subscribe_filter_symbol_id": [
        "COINBASE_",
      ],
      "subscribe_filter_asset_id": this.setFilterAssets(),

    };
    this.socket = new WebSocket(environment.API_URL_WS);

    this.socket.onopen = () => this.socket.send(JSON.stringify(body));
    this.socket.onmessage = (event: MessageEvent) => {
      let message = JSON.parse(event.data);
      this.assetsSubject.value.forEach((item: string) => {
        if (!message.symbol_id) { return; }
        if (message.symbol_id.includes(item)) {
          let messages = this.coinMessagesSubject.getValue();
          messages = { ...messages, [item]: message }
          this.coinMessagesSubject.next(messages);
        }
      });
    }
  }

  setFilterAssets() {
    return this.assetsSubject.value.map((item: string) => {
      return `${ item }/USD`
    })
  }

  setInitialMessages() {
    let messages = {};
    this.assetsSubject.value.forEach((item: string) => {
      messages = { ...messages, [item]: [] };
    });
    return messages;
  }

  socketClose() {
    this.socket.close();
  }

  ngOnDestroy(): void {
    this.socketClose();
  }
}

