import { ItemCondition } from './common.model';
import { IGameEye } from './gameEye.model';
import { IPriceChartingData } from './pricecharting.model';

export interface IAccessory {
  name: string;
  company: string;
  createdAt: string;
  forConsoleId: number;
  forConsoleName: string;
  forClone: boolean;
  forConsoledId: number | string;
  howAcquired: string;
  image: string;
  notes: string;
  officialLicensed: boolean;
  pricePaid: string;
  purchaseDate: string;
  quantity: string;
  type: string;
  updatedAt: string;
  newPurchaseDate?: Date;
  _id: string;
}

export interface IAcc {
  name: string;
  associatedConsole: {
    consoleName: string;
    consoleId: number | null;
  };
  image: string;
  company: string;
  officialLicensed: boolean;
  quantity: number;
  type: string;
  notes: string;
  pricePaid: number | null;
  purchaseDate: string;
  newPurchaseDate?: Date;
  howAcquired: string;
  condition: ItemCondition;
  box: boolean;
  cib: boolean;
  createdAt: string;
  updatedAt: string;
  gameEye?: IGameEye;
  _id?: string;
  priceCharting?: IPriceChartingData;
}
