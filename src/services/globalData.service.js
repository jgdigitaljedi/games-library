import Axios from 'axios';

export const getPlatformArr = () => {
  return new Promise((resolve, reject) => {
    const url = `${window.urlPrefix}/api/vg/utils/platforms`;
    Axios.get(url)
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        console.log('error fetching platform array', error);
        reject(error);
      });
  });
};

export const getPlatformData = async () => {
  const url = `${window.urlPrefix}/api/vg/consoles`;
  const platforms = await Axios.get(url);
  return platforms;
};

export const getEbayPrices = async data => {
  const url = `${window.urlPrefix}/api/vg/ebay`;
  const ebay = await Axios.post(url, data);
  return ebay;
};

export const gamesCount = async () => {
  const url = `${window.urlPrefix}/api/vg/games/total`;
  return await Axios.get(url);
};

export const physicalGamesCount = async () => {
  const url = `${window.urlPrefix}/api/vg/games/physicaltotal`;
  return await Axios.get(url);
};
