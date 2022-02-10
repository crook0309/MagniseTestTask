export interface CoinPriceMessage {
  time_exchange: string;
  time_coinapi: string;
  uuid: string;
  price: number;
  size: number;
  taker_side: string;
  symbol_id: string;
  sequence: number;
  type: string;
}
