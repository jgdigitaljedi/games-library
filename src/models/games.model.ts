import { IConsoleArr } from './platforms.model';

export interface IGame {
  // igdb: {
  // name: string;
  // id: number;
  // genres: string[];
  // total_rating: number;
  // total_rating_count: number;
  // first_release_date: string;
  // developers: string;
  // esrb: string;
  // };
  // gb: {
  //   aliases: string;
  //   guid: string;
  //   gbid: number;
  //   image: string;
  //   deck: string;
  //   platforms: string;
  // };
  id: number;
  total_rating: number;
  total_rating_count: number;
  first_release_date: string;
  esrb: string;
  consoleName: string;
  consoleIgdbId: number;
  consoleGbid: number;
  consoleGbGuid: string;
  condition: string;
  case: string;
  pricePaid: string;
  physical: boolean;
  cib: string | boolean;
  multiplayerNumber: string | number;
  physicalDigital: string[];
  datePurchased: string;
  howAcquired: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  genres: string[];
  consoleArr?: IConsoleArr[];
  extraData?: string[];
  extraDataFull?: IExtraDataFull[];
  compilation: null | IGame[];
  name: string;
  image: string;
  description: string;
  story: string;
  videos?: string[];
  player_perspectives: string[];
  handheld?: boolean;
}

export interface IGbGame {
  install_base: string | number;
  image: string;
  original_price: string | number;
  aliases: string;
  company: string;
  guid: string;
  online_support: boolean;
  gbid: number;
}

export interface IExtraReturn {
  name: string;
  id: string;
  igdbId: number;
  gbId: number;
  gbGuid: string;
  tgdbId: number;
}

export interface IExtraDataFull {
  name: string;
  details?: string[];
  id: string;
  igdbId: number;
  gbId: number;
  gbGuid: string;
  tgdbId?: number;
  isExclusive: IExtraReturn[] | boolean;
  isLaunchTitle: IExtraReturn[] | boolean;
  special: any[];
}

export interface INewGame {
  name: string;
  id: number;
  genres: string[];
  total_rating: number;
  total_rating_count: number;
  first_release_date: string;
  developers: string;
  esrb: string;
  consoleName: string;
  consoleId: number;
  condition: string;
  case: string;
  pricePaid: string;
  physical: boolean;
  cib: string | boolean;
  multiplayerNumber: string | number;
  physicalDigital: string[];
  datePurchased: string;
  howAcquired: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  consoleArr?: IConsoleArr[];
  extraData?: string[];
  extraDataFull?: IExtraDataFull[];
  compilation: null | IGame[];
  image?: string;
  description?: string;
  handheld?: boolean;
}
