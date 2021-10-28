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

const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');

const nameSearchEndpoint = 'pcnamesearch';
const idPriceSearchEndpoint = 'pcgetprice';
const getGameStats = 'pcgamestats';
const getPlatformStats = 'pcplatformstats';

export type IPcFormatType = 'GAME' | 'CONSOLE' | 'ACC';

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
    const params = makeRequest(which === 'GAME' ? getGameStats : getPlatformStats);
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
  item: IGame | IConsole | IItemCommonFormat,
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
  if ((item as IConsole).box && (item as IConsole).manual && item.notes.indexOf('sealed') >= 0) {
    return 'sealed';
  } else if ((item as IConsole).box && (item as IConsole).manual) {
    return 'cib';
  }
  return 'loose';
}

function getPriceForBoxCase(data: PricechartingGameSearchResponse, boxCase: IPCCaseType): number {
  if (boxCase === 'sealed') {
    return data['new-price'] || 0;
  } else if (boxCase === 'cib') {
    return data['cib-price'] || 0;
  }
  return data['loose-price'] || 0;
}

export const formatUpdateData = (
  result: PricechartingGameSearchResponse,
  previous: IPriceChartingData
): IPriceChartingData => {
  const newPrice = getPriceForBoxCase(result, previous.case);
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
  const itemPrice = getPriceForBoxCase(data, boxCase);
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

function getCibStatus(item: IGame | IConsole | IAcc, type: string): boolean {
  switch (type) {
    case 'GAME':
    case 'ACC':
      // @ts-ignore
      return !!item?.cib;
    case 'CONSOLE':
      return !!((item as IConsole)?.manual && (item as IConsole)?.box);
    default:
      return false;
  }
}

function getConsoleName(item: IGame | IConsole | IAcc, type: string): string {
  switch (type) {
    case 'GAME':
    case 'ACC':
      // @ts-ignore
      return item?.consoleName;
    case 'CONSOLE':
      return item?.name;
    default:
      return '';
  }
}

function getConsoleId(item: IGame | IConsole | IAcc, type: string): number {
  switch (type) {
    case 'GAME':
    case 'ACC':
      // @ts-ignore
      return item?.consoleId;
    case 'CONSOLE':
      // @ts-ignore
      return item?.id;
    default:
      return 9999999999999999999999;
  }
}

function getBox(item: IGame | IConsole | IAcc, type: string): boolean {
  switch (type) {
    case 'GAME':
      return !!(item as IGame)?.cib;
    case 'ACC':
    case 'CONSOLE':
      // @ts-ignore
      return !!item?.box;
    default:
      return false;
  }
}

function getManual(item: IGame | IConsole | IAcc, type: string): boolean {
  switch (type) {
    case 'ACC':
      return !!(item as IAcc)?.cib;
    case 'GAME':
    case 'CONSOLE':
      // @ts-ignore
      return !!item?.manual;
    default:
      return false;
  }
}

export function formatFormResult(
  data: IGame | IConsole | IAcc,
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
    notes: data?.notes || '',
    type
  };
}
