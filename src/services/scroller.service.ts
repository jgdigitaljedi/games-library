// export class ScrollerService {
//   numToLoad = 0;
//   numLoaded = 0;
//   masterData = [];
//   loaded = [];
//   constructor(height: number, width: number, data: any[]) {
//     // @ts-ignore
//     this.masterData = data;
//     const gameCardWidth = 160;
//     const gameCardHeight = 248;

//     const navHeight = 80;
//     const padding = 32;
//     const counterHeight = 84;
//     const filterBoxHeight = this.dealWithFilters(width);
//     const totalTopper = navHeight + padding + counterHeight + (filterBoxHeight as number);
//     const remaining = height - totalTopper;

//     const perRow = (width - padding) / gameCardWidth;
//     const numRows = remaining / gameCardHeight;

//     this.numToLoad = Math.floor(perRow * numRows);
//     this.loaded = this.masterData.slice(0, this.numToLoad);
//   }

//   dealWithFilters(width: number) {
//     if (width >= 2000) {
//       return 170;
//     } else if (width > 700 && width < 2000) {
//       return 230;
//     }
//   }

//   loadMore() {
//     const newLength = this.loaded.length + this.numToLoad;
//     this.loaded = this.masterData.slice(0, newLength);
//   }

// }
function dealWithFilters(width: number) {
  if (width >= 2000) {
    return 170;
  } else if (width > 700 && width < 2000) {
    return 230;
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

  const perRow = (width - padding) / gameCardWidth;
  const numRows = remaining / gameCardHeight;

  return Math.floor(perRow * numRows);

};



export const loadMore = () => {
  console.log('loadMore');
};