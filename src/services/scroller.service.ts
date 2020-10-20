
function dealWithFilters(width: number) {
  if (width >= 2000) {
    return 170;
  } else if (width >= 1110 && width < 2000) {
    return 230;
  } else if (width > 870 && width < 1110) {
    return 390;
  } else if (width >= 769 && width < 870) {
    return 500;
  } else if (width >= 769 && width < 870) {
    return 347;
  } else if (width >= 692 && width < 769) {
    
  }
}

export const calculateNumToLoad = (height: number, width: number) => {
  // game cards are 160px wide and 248px tall and that should be consistent
  // view has 1rem padding so 2rem total to figure into width and 2rem for height
  // navbar is 80px tall
  // for now we'll say filter box is roughly 170px tall, 230px tall when a littler smaller, and it keeps growing accordingly
  const gameCardWidth = 160;
  const gameCardHeight = 248;

  const navHeight = 80;
  const padding = 32;
  const counterHeight = 84;
  const filterBoxHeight = dealWithFilters(width);
  const totalTopper = navHeight + padding + counterHeight + (filterBoxHeight || 0);
  const remaining = height - totalTopper;

  const perRow = Math.floor((width - padding) / gameCardWidth);
  const numRows = Math.floor(remaining / gameCardHeight);

  // this always leaves a couple extra at the bottom
  // that is intentional so it has something to scroll to to trigger adding more
  return Math.floor(perRow * numRows);

};