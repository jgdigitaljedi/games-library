export interface IConsoleArr {
  consoleName: string;
  consoleId: number;
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
  extraDataFull?: object[];
}

export interface IFormState {
  name: string;
  players: number;
  genre: string;
  esrb: string;
  platform: string;
  everDrive: boolean;
}
