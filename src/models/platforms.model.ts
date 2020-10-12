import { IGbGame } from './games.model';

export interface IConsoleArr {
  consoleName: string;
  consoleId: number;
}

interface IIgdbConsole {
  name: string;
  id: number;
  logo: string;
  generation: number;
  version: string;
}

interface IGBConsole {
  aliases: string;
  company: string;
  gbid: number;
  guid: string;
  image: string;
  install_base: string;
  online_support: boolean;
  original_price: string;
}

export interface IConsole {
  igdb: IIgdbConsole;
  gb: IGBConsole;
  condition: string;
  box: string;
  mods: string;
  notes: string;
  connectedBy?: string;
  upscaler?: boolean;
  datePurchased: string;
  purchasePrice: string | number;
  ghostConsole: boolean;
  aliases: string;
  storage: string | number;
  unit: string;
  howAcquired: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  newDatePurchased?: Date;
  _id: string;
}
