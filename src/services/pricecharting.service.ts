import { IGame } from '@/models/games.model';
import { IConsole } from '@/models/platforms.model';
import {
  IItemCommonFormat,
  IPCCaseType,
  IPriceChartingData,
  PricechartingGameSearchResponse
} from '@/models/pricecharting.model';
import Axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';
import { CurrencyUtils } from 'stringman-utils';
import { IAcc } from '@/models/accessories.model';
import { IClone, ViewWhatType } from '@/models/common.model';
import { ICollectible } from '@/models/collectibles.model';

const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');

const nameSearchEndpoint = 'pcnamesearch';
const idPriceSearchEndpoint = 'pcgetprice';
const mostValuableGames = 'pcvaluegames';
const mostValuablePlatforms = 'pcvalueplatforms';

const pcStatsEndpoints = {
  GAME: 'pcgamestats',
  CONSOLE: 'pcplatformstats',
  ACC: 'pcaccstats',
  CLONE: 'pcclonestats',
  COLL: 'pccollstats'
};

interface IPcUpdateEndpoints {
  games: string;
  consoles: string;
  accessories: string;
  clones: string;
  collectibles: string;
  hardware: string;
}

const pcUpdateEndpoints: IPcUpdateEndpoints = {
  games: 'pcupdategames',
  consoles: 'pcupdateconsoles',
  accessories: 'pcupdateacc',
  clones: 'pcupdateclones',
  collectibles: 'pcupdatecollectibles',
  hardware: ''
};

export type IPcFormatType = 'GAME' | 'CONSOLE' | 'ACC' | 'CLONE' | 'COLL';

export const pricechartingNameSearch = async (
  game: string
): Promise<AxiosResponse<PricechartingGameSearchResponse[]> | any> => {
  const hasKey = !!getRequestKey();

  if (hasKey && game) {
    const params = makeRequest(nameSearchEndpoint);
    try {
      const result = await Axios.post(params.url, { item: game }, params.headers);
      return result;
    } catch (error) {
      return error;
    }
  }
  return Promise.resolve({
    error: true,
    message: 'You must be logged in to fetch items from backend!'
  });
};

export const getPriceById = async (
  id: number | string
): Promise<AxiosResponse<PricechartingGameSearchResponse> | any> => {
  const hasKey = !!getRequestKey();
  if (hasKey && id) {
    const params = makeRequest(idPriceSearchEndpoint);
    try {
      const result = await Axios.post(params.url, { id: id.toString() }, params.headers);
      return result;
    } catch (error) {
      return error;
    }
  }
  return Promise.resolve({
    error: true,
    message: 'You must be logged in to fetch items from backend!'
  });
};

export const getPcStats = async (which: IPcFormatType): Promise<any> => {
  const hasKey = !!getRequestKey();
  if (hasKey) {
    const params = makeRequest(pcStatsEndpoints[which]);
    try {
      const result = await Axios.get(params.url);
      return result;
    } catch (error) {
      return error;
    }
  }
  return Promise.resolve({
    error: true,
    message: 'You must be logged in to fetch items from backend!'
  });
};

function getBoxSituation(
  item: IGame | IConsole | IAcc | ICollectible | IItemCommonFormat,
  type: IPcFormatType
): IPCCaseType {
  if (type === 'GAME') {
    if ((item as IGame).cib && item.notes.indexOf('sealed') >= 0) {
      return 'sealed';
    } else if ((item as IGame).cib) {
      return 'cib';
    }
    return 'loose';
  }
  if (
    type === 'CONSOLE' &&
    (item as IConsole).box &&
    (item as IConsole).manual &&
    item.notes.indexOf('sealed') >= 0
  ) {
    return 'sealed';
  } else if ((item as IConsole).box && (item as IConsole).manual) {
    return 'cib';
  }
  if (
    (type === 'COLL' && (item as ICollectible).notes.indexOf('box') >= 0) ||
    (item as ICollectible).notes.indexOf('sealed') >= 0
  ) {
    return 'sealed';
  }
  return 'loose';
}

function getPriceForBoxCase(
  data: PricechartingGameSearchResponse,
  boxCase: IPCCaseType,
  hasManual?: boolean
): number {
  console.log('data', data);
  let initialPrice;
  if (boxCase === 'sealed') {
    initialPrice = Math.abs(data['new-price'] || 0);
  } else if (boxCase === 'cib') {
    initialPrice = Math.abs(data['cib-price'] || 0);
  } else {
    initialPrice = Math.abs(data['loose-price'] || 0);
  }
  if (hasManual && boxCase !== 'cib' && data['manual-only-price']) {
    initialPrice += data['manual-only-price'];
  }
  return initialPrice;
}

export const formatUpdateData = (
  result: PricechartingGameSearchResponse,
  previous: IPriceChartingData,
  hasManual?: boolean
): IPriceChartingData => {
  const newPrice = getPriceForBoxCase(result, previous.case, hasManual);
  const lastUpdated = moment().format('MM/DD/YYYY');
  return {
    ...previous,
    lastUpdated,
    price: currencyUtils.minorToMajorUnits(newPrice, false) as number
  };
};

export const formatPcResult = (
  data: PricechartingGameSearchResponse,
  item: IGame | IConsole | IItemCommonFormat,
  type: IPcFormatType
): IPriceChartingData => {
  const boxCase = getBoxSituation(item, type);
  const itemPrice = getPriceForBoxCase(data, boxCase, item.manual);
  const lastUpdated = moment().format('MM/DD/YYYY');
  return {
    consoleName: data['console-name'] || '',
    id: data.id,
    price: currencyUtils.minorToMajorUnits(itemPrice, false) as number,
    name: data['product-name'],
    case: boxCase,
    lastUpdated
  };
};

function getCibStatus(
  item: IGame | IConsole | IAcc | IClone | ICollectible,
  type: string
): boolean {
  switch (type) {
    case 'GAME':
    case 'ACC':
      // @ts-ignore
      return !!item?.cib;
    case 'CONSOLE':
      return !!((item as IConsole)?.manual && (item as IConsole)?.box);
    case 'CLONE':
      return true; // @TODO: all of mine are CIB for now, need to add CIB to clones
    case 'COLL':
      return (
        (item as ICollectible)?.notes?.indexOf('box') >= 0 ||
        (item as ICollectible)?.notes?.indexOf('sealed') >= 0
      );
    default:
      return false;
  }
}

function getConsoleName(
  item: IGame | IConsole | IAcc | IClone | ICollectible,
  type: string
): string {
  switch (type) {
    case 'GAME':
    case 'ACC':
      // @ts-ignore
      return item?.consoleName;
    case 'CONSOLE':
    case 'CLONE':
      return item?.name;
    case 'COLL':
      const associatedConsoles = (item as ICollectible)?.associatedConsoles;
      return associatedConsoles?.length > 0 ? associatedConsoles[0].name : '';
    // return (item as ICollectible)?.associatedConsoles[0].name || '';
    default:
      return '';
  }
}

function getConsoleId(item: IGame | IConsole | IAcc | IClone | ICollectible, type: string): number {
  switch (type) {
    case 'GAME':
    case 'ACC':
      // @ts-ignore
      return item?.consoleId;
    case 'CONSOLE':
      // @ts-ignore
      return item?.id;
    case 'COLL':
      const associatedConsoles = (item as ICollectible)?.associatedConsoles;
      return associatedConsoles?.length > 0
        ? parseInt(associatedConsoles[0].id.toString())
        : 9999999999999999999999;
    case 'CLONE':
    default:
      return 9999999999999999999999;
  }
}

function getBox(item: IGame | IConsole | IAcc | IClone | ICollectible, type: string): boolean {
  switch (type) {
    case 'GAME':
      return !!(item as IGame)?.cib;
    case 'ACC':
    case 'CONSOLE':
      // @ts-ignore
      return !!item?.box;
    case 'CLONE':
      return true; // @TODO: all of mine are CIB for now, need to add box to clones
    case 'COLL':
      return ((item as ICollectible)?.notes || '').indexOf('box') >= 0;
    default:
      return false;
  }
}

function getManual(item: IGame | IConsole | IAcc | IClone | ICollectible, type: string): boolean {
  switch (type) {
    case 'ACC':
      return !!(item as IAcc)?.cib;
    case 'GAME':
    case 'CONSOLE':
      // @ts-ignore
      return !!item?.manual;
    case 'CLONE':
      return true; // @TODO: all of mine are CIB for now, need to add manual to clones
    case 'COLL':
      return ((item as ICollectible)?.notes || '').indexOf('box') >= 0;
    default:
      return false;
  }
}

export function formatFormResult(
  data: IGame | IConsole | IAcc | IClone | ICollectible,
  type: IPcFormatType
): IItemCommonFormat {
  return {
    name: data?.name || '',
    cib: getCibStatus(data, type),
    consoleName: getConsoleName(data, type),
    // @ts-ignore
    consoleId: getConsoleId(data, type),
    box: getBox(data, type),
    manual: getManual(data, type),
    // @ts-ignore
    notes: type === 'CLONE' ? '' : data?.notes || '', // @TODO: add notes to clones
    type,
    // @ts-ignore
    priceCharting: data?.priceCharting || undefined
  };
}

export async function getHighestValueGames(): Promise<AxiosResponse<IGame[]> | any> {
  const hasKey = !!getRequestKey();
  if (hasKey) {
    const params = makeRequest(mostValuableGames);
    try {
      const result = await Axios.get(params.url);
      return result;
    } catch (error) {
      return error;
    }
  }
  return Promise.resolve({
    error: true,
    message: 'You must be logged in to fetch items from backend!'
  });
}

export async function getHighestValuePlatforms(): Promise<AxiosResponse<IConsole[]> | any> {
  const hasKey = !!getRequestKey();
  if (hasKey) {
    const params = makeRequest(mostValuablePlatforms);
    try {
      const result = await Axios.get(params.url);
      return result;
    } catch (error) {
      return error;
    }
  }
  return Promise.resolve({
    error: true,
    message: 'You must be logged in to fetch items from backend!'
  });
}

export function updatesPcPrices(viewWhat: ViewWhatType): Promise<AxiosResponse<any>> {
  return new Promise((resolve, reject) => {
    const hasKey = !!getRequestKey();
    if (hasKey) {
      const params = makeRequest(pcUpdateEndpoints[viewWhat]);
      try {
        resolve(Axios.get(params.url));
      } catch (error) {
        reject(error);
      }
    }
    reject({
      error: true,
      message: 'You must be logged in to fetch items from backend!'
    });
  });
}
