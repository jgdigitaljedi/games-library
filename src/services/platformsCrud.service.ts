import Axios, { AxiosResponse } from 'axios';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';
import { get as _get, sortBy as _sortBy } from 'lodash';
import { IConsole, IConsoleReleaseDate } from '@/models/platforms.model';
import moment from 'moment';

const endpoint = 'consoles';

const preferredRegionIds = {
  '2': 'North America',
  '8': 'Worldwide',
  '1': 'Europe',
  '5': 'Japan'
};

const categoryBreakdown = {
  '1': 'console',
  '2': 'arcade',
  '3': 'platform',
  '4': 'operating system',
  '5': 'portable console',
  '6': 'computer'
};

interface FormattedError {
  error: boolean;
  message: string;
  data: any;
}

interface RawPlatformVersion {
  id: number | null;
  name: string | null;
  platform_version_release_dates: {
    id: number;
    date: number;
  }[];
}

interface RawPlatformReleaseDate {
  id: number;
  human: string;
  region: number;
}

export interface RawPlatform {
  id: number;
  generation: number;
  name: string;
  alternative_name?: string;
  category?: number;
  platform_logo: {
    id: number;
    url: string;
  };
  url: string;
  versions: RawPlatformVersion[];
  logo: string;
  cpu: string | null;
  media: string | null;
  memory: string | null;
  output: string | null;
  os: string | null;
  connectivity: string | null;
  releaseDate: RawPlatformReleaseDate[];
  summary?: string;
  storage?: string;
  resolutions?: string;
}

export const getPlatformsWithIds = async () => {
  const url = `${window.urlPrefix}/api/vg/utils/platformids`;
  return await Axios.get(url);
};

export const igdbPlatformSearch = async (name: string): Promise<AxiosResponse | FormattedError> => {
  const hasKey = !!getRequestKey();
  if (hasKey && name) {
    const params = makeRequest('searchplatform');
    const body = {
      platform: name
    };
    const request = await Axios.post(params.url, body, params.headers);
    return request;
  } else {
    return Promise.resolve({
      error: true,
      message: 'You must be logged in to search IGDB and you must at least send a name!',
      data: null
    });
  }
};

export const igdbPlatformVersions = async (
  platform: any
): Promise<AxiosResponse | FormattedError> => {
  const hasKey = !!getRequestKey();
  const platformVersionId = _get(platform, 'versions[0].id', null);
  if (hasKey && platformVersionId) {
    const params = makeRequest('searchplatformversions');
    const body = {
      platform: platformVersionId
    };
    console.log('request body in client', body);
    const request = await Axios.post(params.url, body, params.headers);
    return request;
  } else {
    if (!hasKey) {
      return Promise.resolve({
        error: true,
        message: 'You must be logged in to search IGDB and you must at least send a name!',
        data: null
      });
    } else {
      return Promise.resolve({
        error: true,
        message: 'Improper request: could not get platform version id!',
        data: null
      });
    }
  }
};

const getPlatformVersion = (rawPlatform: RawPlatform) => {
  if (rawPlatform.versions?.length) {
    return {
      id: rawPlatform.versions[0].id,
      name: rawPlatform.versions[0].name || ''
    };
  } else {
    return {
      id: null,
      name: ''
    };
  }
};

const getReleaseDate = (
  prd: RawPlatformReleaseDate[] | RawPlatformReleaseDate
): IConsoleReleaseDate => {
  if (!Array.isArray(prd)) {
    // @ts-ignore
    const region = preferredRegionIds[prd.region.toString()] || '';
    return {
      region,
      date: moment(prd.human).format('MM/DD/YYYY')
    };
  } else {
    const regionArr = prd.map(d => d.region.toString());
    const regionArrWithNames = _sortBy(
      Object.keys(preferredRegionIds)
        .map((key: string, index: number) => {
          const indOf = regionArr.indexOf(key);
          if (indOf >= 0) {
            return {
              index: indOf,
              // @ts-ignore
              region: preferredRegionIds[regionArr[indOf]],
              date: moment(prd[indOf].human).format('MM/DD/YYYY')
            };
          }
          return null;
        })
        .filter(n => n),
      'index'
    );
    console.log('regionArrWithNames', regionArrWithNames);
    return {
      region:
        // @ts-ignore
        regionArrWithNames?.length && regionArrWithNames[0].hasOwnProperty('region')
          ? // @ts-ignore
            regionArrWithNames[0].region
          : null,
      date:
        // @ts-ignore
        regionArrWithNames?.length && regionArrWithNames[0].hasOwnProperty('date')
          ? // @ts-ignore
            moment(regionArrWithNames[0].date).format('MM/DD/YYYY')
          : null
    };
  }
};

const getCategory = (cat?: number): string => {
  if (!cat) {
    return '';
  }
  const catStr = cat.toString();
  // @ts-ignore
  return categoryBreakdown[catStr];
};

export const formatNewPlatformForSave = (rawPlatform: RawPlatform): IConsole => {
  console.log('id in format', rawPlatform.id);
  return {
    id: rawPlatform.id || 99999,
    alternative_name: rawPlatform.alternative_name || '',
    category: getCategory(rawPlatform.category),
    generation: rawPlatform.generation || null,
    name: rawPlatform.name,
    version: getPlatformVersion(rawPlatform),
    condition: null,
    box: false,
    manual: false,
    mods: '',
    notes: '',
    datePurchased: moment().format('YYYY-MM-DD'),
    pricePaid: null,
    ghostConsole: false,
    createdAt: moment().format('MM/DD/YYYY'),
    lastUpdated: moment().format('MM/DD/YYYY'),
    howAcquired: '',
    updatedAt: '',
    connectivity: rawPlatform.connectivity || null,
    cpu: rawPlatform.cpu || '',
    media: rawPlatform.media || '',
    memory: rawPlatform.memory || '',
    output: rawPlatform.output || '',
    os: rawPlatform.os || null,
    logo: rawPlatform.platform_logo?.url ? `https:${rawPlatform.platform_logo.url}` : null,
    releaseDate: rawPlatform.releaseDate
      ? getReleaseDate(rawPlatform.releaseDate)
      : { region: null, date: null },
    summary: rawPlatform.summary || '',
    storage: rawPlatform.storage || '',
    resolutions: rawPlatform.resolutions || ''
  };
};

export const savePlatform = async (platform: IConsole, addMode: boolean) => {
  const hasKey = !!getRequestKey();
  console.log('platform to be updated', platform);
  if (!addMode && hasKey) {
    const params = makeRequest(endpoint, platform._id);
    const result = await Axios.patch(params.url, { platform }, params.headers);
    return result;
  } else if (hasKey) {
    const params = makeRequest(endpoint);
    console.log('param', params);
    console.log('platform', platform);
    const result = await Axios.put(params.url, { platform }, params.headers);
    return result;
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};

export const igdbUpdatePlatformById = async (
  platform: IConsole
): Promise<AxiosResponse<IConsole> | any> => {
  const hasKey = !!getRequestKey();
  if (hasKey && platform?.id) {
    const params = makeRequest('updateplatformigdb', platform.id.toString());
    const request = await Axios.post(params.url, { platform }, params.headers);
    return request;
  } else {
    return {
      error: true,
      message: 'You must be logged in to search IGDB and you must at least send an ID!'
    };
  }
};

export const updateAllIgdbPlatformData = async (): Promise<AxiosResponse<any> | any> => {
  const hasKey = !!getRequestKey();
  if (hasKey) {
    const params = makeRequest('updatealligdbplatforms');
    const request = await Axios.post(params.url, params.headers);
    return request.data;
  } else {
    return {
      error: true,
      message: 'You must be logged in to update all IGDB platforms data!'
    };
  }
};
