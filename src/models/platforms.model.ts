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

export interface IConsoleOld {
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

export type Category = 'console' | 'operating_system' | 'arcade' | 'platform' | 'portable_console' | 'computer';

export type Condition = 'Excellent' | 'Good' | 'Fair' | 'Rough' | 'Not Working/No Physical Damage' |
    'Working/Physical Damage' | 'Not Working/Physical Damage' | 'Partially Working' | 'Other';

export interface IConsoleVersion {
  id: number;
  name: string;
}

export interface IConsoleDate {
  date: string;
  region: string;
}

export interface IConsole {
  id: number;
  alternative_name: string;
  category: Category;
  generation: number;
  name: string;
  versions: IConsoleVersion;
  condition: Condition;
  box: boolean;
  manual: boolean;
  mods: string;
  notes: string;
  datePurchased: string | null;
  pricePaid: number | null;
  ghostConsole: boolean;
  createdAt: string;
  _id: string; // diskDB id so never change it
  howAcquired: string;
  updatedAt: string;
  cpu: string | null;
  media: string | null;
  memory: string;
  output: string | null;
  os: string | null;
  logo: string | undefined;
  releaseDate: IConsoleDate;
  connectivity: string;
  newDatePurchased?: Date;
}