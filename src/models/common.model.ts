import { ICollAssociatedCon } from './collectibles.model';
import { IGame } from './games.model';
import { IConsole } from './platforms.model';
import { IPriceChartingData } from './pricecharting.model';

export type Severity = 'success' | 'info' | 'error' | 'warn' | '';
export type ItemCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Not Working';

export interface GenericError {
  error: boolean;
  message: string;
  code?: object;
}

export interface INotification {
  severity: Severity;
  detail: string;
  summary?: string;
  life?: number;
}

export interface IFormState {
  name: string;
  players: number;
  genre: string[];
  esrb: string;
  platform: string[];
  everDrive: boolean;
  physical?: boolean;
  location?: string | null;
  handheld?: string;
  vr: boolean;
  releaseDateStart?: number;
  releaseDateEnd?: number;
}

export interface IDropdown {
  label: string;
  value: string;
}

export interface IDataTitlesIndex {
  [key: string]: string;
}

export interface IIndexStringArr {
  [key: string]: string[];
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
  newPurchaseDate?: Date;
  _id: string;
  priceCharting?: IPriceChartingData;
}

export interface IDateRelated {
  dateFormatted: string;
  games: number;
}

interface ICatVal {
  category: string;
  value: number;
}

export interface IStats {
  mostRecentlyAddedGames: IGame[];
  mostRecentlyAddedPlatforms: IConsole[];
  mostPaidForGames: IGame[];
  mostPaidForPlatforms: IConsole[];
  gamePerConsoleCounts: IIndexedWithNum;
  gamesPerEsrb: IIndexedWithNum;
  physicalVsDigitalGames: IIndexedWithNum;
  gamesAcquisition: IIndexedWithNum;
  cibGames: number;
  gamesWithGenre: IIndexedWithNum;
  gamesAddedInMonth: IDateRelated[];
  gamesAddedPerYear: IDateRelated[];
  igdbRatingsBreakdown: ICatVal;
  platformCompanies: IIndexedWithNum;
  consolesByGenerationSorted: IIndexedWithNum;
  gamesByDecade: IIndexedWithNum;
  totalGames: number;
  totalPlatforms: number;
  totalAccessories: number;
  totalClones: number;
  everDriveCounts: number;
  priceBreakdown: any;
  nesBBOwned: number;
  nesBBTotal: number;
  nesHangTabsGamesOwned: number;
  nesHangTabTotal: number;
  genesisBBGridOwned: number;
  genesisBBGridTotal: number;
}

export type ViewWhatType =
  | 'games'
  | 'consoles'
  | 'accessories'
  | 'clones'
  | 'collectibles'
  | 'hardware';
