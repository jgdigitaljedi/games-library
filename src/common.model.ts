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
  // pirated: string;
  multiplayerNumber: string | number;
  physicalDigital: string[];
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
  image?: string;
  description?: string;
  handheld?: boolean;
}

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

export interface ICollAssociatedCon {
  id: number | string;
  name: string;
}

export interface ICollectible {
  associatedConsoles: ICollAssociatedCon[];
  associatedGame: string;
  character: string;
  company: string;
  createdAt: string;
  howAcquired: string;
  image: string;
  name: string;
  notes: string;
  newPurchaseDate: Date;
  officialLicensed: string | boolean;
  pricePaid: string | number;
  purchaseDate: string;
  quantity: string | number;
  type: string;
  updatedAt: string;
  _id: string;
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
