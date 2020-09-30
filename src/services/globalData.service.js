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
