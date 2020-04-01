export default {
  getTodayYMD: dateString => {
    const dSplit = dateString.split('-');
    return new Date(`${dSplit[1]}/${dSplit[2]}/${dSplit[0]}`);
  }
};
