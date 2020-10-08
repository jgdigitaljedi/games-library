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

export interface IConsole {
  igdb: IIgdbConsole;
  gb: IGbGame;
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
