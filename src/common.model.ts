export interface IConsoleArr {
  consoleName: string;
  consoleId: number;
}

export interface IExtraReturn {
  name: string;
  id: string;
  igdbId: number;
  gbId: number;
  gbGuid: string;
  tgdbId: number;
}

interface IExtraDataFull {
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

export interface IGame {
  igdb: {
    name: string;
    id: number;
    genres: string[];
    total_rating: number;
    total_rating_count: number;
    first_release_date: string;
    developers: string;
    esrb: string;
  };
  gb: {
    aliases: string;
    guid: string;
    gbid: number;
    image: string;
    deck: string;
    platforms: string;
  };
  consoleName: string;
  consoleIgdbId: number;
  consoleGbid: number;
  consoleGbGuid: string;
  condition: string;
  case: string;
  pricePaid: string;
  physical: boolean;
  cib: string | boolean;
  pirated: string;
  multiplayerNumber: string | number;
  datePurchased: string;
  howAcquired: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  genres: string;
  consoleArr?: IConsoleArr[];
  extraData?: string[];
  extraDataFull?: IExtraDataFull[];
  compilation: null | IGame[];
  name?: string;
}

export interface IFormState {
  name: string;
  players: number;
  genre: string;
  esrb: string;
  platform: string;
  everDrive: boolean;
}

export interface IDropdown {
  label: string;
  value: string;
}

interface IIgdbConsole {
  name: string;
  id: number;
  logo: string;
  generation: number;
  version: string;
}

interface IGbGame {
  install_base: string | number;
  image: string;
  original_price: string | number;
  aliases: string;
  company: string;
  guid: string;
  online_support: boolean;
  gbid: number;
}

export interface IConsole {
  igdb: IIgdbConsole;
  gb: IGbGame;
  condition: string;
  box: boolean;
  mods: string;
  notes: string;
  connectedBy: string;
  upscaler: boolean;
  datePurchased: string;
  purchasePrice: string | number;
  ghostConsole: boolean;
  aliases: string;
  storage: string | number;
  unit: string;
  howAcquired: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
