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

const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');

const nameSearchEndpoint = 'pcnamesearch';
const idPriceSearchEndpoint = 'pcgetprice';
const getGameStats = 'pcgamestats';
const getPlatformStats = 'pcplatformstats';

export type IPcFormatType = 'GAME' | 'CONSOLE';

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

export function formatFormResult(data: IGame | IConsole, type: IPcFormatType): IItemCommonFormat {
  return {
    name: data?.name || '',
    cib: type === 'GAME' ? !!(data as IGame)?.cib : !!(data?.manual && (data as IConsole)?.box),
    consoleName: type === 'GAME' ? (data as IGame)?.consoleName : data?.name,
    // @ts-ignore
    consoleId: type === 'GAME' ? (data as IGame)?.consoleId : data?.id,
    box: type === 'CONSOLE' ? !!(data as IConsole)?.box : !!(data as IGame)?.cib,
    manual: data?.manual || false,
    notes: data?.notes || '',
    type
  };
}
