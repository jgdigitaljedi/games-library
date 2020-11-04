import Axios from 'axios';

export const getPlatformsWithIds = async () => {
  const url = `${window.urlPrefix}/api/vg/utils/platformids`;
  return await Axios.get(url);
};
