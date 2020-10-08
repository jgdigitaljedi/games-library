import { ICollAssociatedCon } from './collectibles.model';

export interface IFormState {
  name: string;
  players: number;
  genre: string;
  esrb: string;
  platform: string;
  everDrive: boolean;
  physical?: boolean;
  location?: string | null;
  handheld?: string;
}

export interface IDropdown {
  label: string;
  value: string;
}

export interface IDataTitlesIndex {
  [key: string]: string;
}

export interface IIndexedWithNum {
  [key: string]: number;
}

export interface IHardware {
  name: string;
  company: string;
  conCleaned: string;
  forConsoles: ICollAssociatedCon[];
  howAcquired: string;
  image: string;
  newPurchaseDate?: Date;
  notes: string;
  pricePaid: string | number;
  purchaseDate: string;
  quantity: number;
  type: string;
  updatedAt: string;
  _id: string;
}

export interface IClone {
  name: string;
  company: string;
  consolesEmulated: string;
  controllerNumber: number;
  gamesAddedNumber: string | number;
  gamesIncludedAmount: string | number;
  hacked: boolean;
  hd: boolean;
  maxPlayers: string | number;
  pricePaid: string | number;
  takesOriginalControllers: boolean;
  wireless: boolean;
  updatedAt: string;
  image: string;
  datePurchased: string;
  newPurchaseDate: Date;
  _id: string;
}
