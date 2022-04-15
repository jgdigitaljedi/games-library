import React, { FunctionComponent, useCallback, useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import ListView from './components/ListView/ListView';
import { Chart } from 'primereact/chart';
import ChartService from './services/chartData.service';
import Colors from './style/colors';
import HomeTopTables from './components/HomeTopTables/HomeTopTables';
import HomeTopPrices from './components/HomeTopPrices/HomeTopPrices';
import { IStats } from './models/common.model';
import { NotificationContext } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import {
  getHighestValueGames,
  getHighestValuePlatforms,
  getPcStats
} from './services/pricecharting.service';
import { CurrencyUtils } from 'stringman-utils';
import { IPcStatsTotalsDynamic, IPcStatsTotalsFixed } from './models/pricecharting.model';
import { IGame } from './models/games.model';
import { IConsole } from './models/platforms.model';
import HomeSeriesSection from './components/HomeSeriesSection/HomeSeriesSection';

const Home: FunctionComponent<RouteComponentProps> = () => {
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
  // @ts-ignore
  const [data, setData] = useState<IStats>({});
  const [extraData, setExtraData] = useState<any>({}); // TODO: type this when call is finished
  const [pcGameStats, setPcGameStats] = useState<IPcStatsTotalsFixed & IPcStatsTotalsDynamic>();
  const [pcPlatformStats, setPcPlatformStats] = useState<
    IPcStatsTotalsFixed & IPcStatsTotalsDynamic
  >();
  const [pcAccStats, setPcAccStats] = useState<IPcStatsTotalsFixed & IPcStatsTotalsDynamic>();
  const [pcCloneStats, setPcCloneStats] = useState<IPcStatsTotalsFixed & IPcStatsTotalsDynamic>();
  const [pcCollStats, setPcCollStats] = useState<IPcStatsTotalsFixed & IPcStatsTotalsDynamic>();
  const [highValueGames, setHighValueGames] = useState<IGame[]>([]);
  const [highValuePlatforms, setHighValuePlatforms] = useState<IConsole[]>([]);
  const chartOptions = {
    responsive: true,
    responsiveAnimationDuration: 300,
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: Colors.lightKhaki
      }
    }
  };

  const extraChartOptions = ChartService.getExtraChartOptions();
  const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');

  function addTitle(text: string) {
    return {
      title: {
        text,
        position: 'top',
        fontColor: Colors.white,
        display: true,
        fontSize: 16
      }
    };
  }

  const getData = useCallback(async () => {
    const result = await Axios.get(`${window.urlPrefix}/api/vg/stats`);
    if (result && result.data) {
      console.log('home data', result.data);
      setData(result.data);
    } else {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch home stats!',
        summary: 'ERROR'
      });
    }
    try {
      const gameStats = await getPcStats('GAME');
      setPcGameStats(gameStats.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch PriceCharting games stats!',
        summary: 'ERROR'
      });
    }
    try {
      const platformStats = await getPcStats('CONSOLE');
      setPcPlatformStats(platformStats.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch PriceCharting platforms stats!',
        summary: 'ERROR'
      });
    }
    try {
      const accStats = await getPcStats('ACC');
      setPcAccStats(accStats.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch PriceCharting accessories stats!',
        summary: 'ERROR'
      });
    }
    try {
      const cloneStats = await getPcStats('CLONE');
      setPcCloneStats(cloneStats.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch PriceCharting clones stats!',
        summary: 'ERROR'
      });
    }
    try {
      const collStats = await getPcStats('COLL');
      setPcCollStats(collStats.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch PriceCharting collectibles stats!',
        summary: 'ERROR'
      });
    }
    try {
      const valuableGames = await getHighestValueGames();
      setHighValueGames(valuableGames.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch highest value games!',
        summary: 'ERROR'
      });
    }
    try {
      const valuablePlats = await getHighestValuePlatforms();
      setHighValuePlatforms(valuablePlats.data);
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch highest value games!',
        summary: 'ERROR'
      });
    }
  }, [setNotify]);

  const getExtra = useCallback(async () => {
    const result = await Axios.get(`${window.urlPrefix}/api/vg/extra`);
    if (result && result.data) {
      console.log('extra data', result.data);
      setExtraData(result.data);
    } else {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch launch and exclusives data!',
        summary: 'ERROR'
      });
    }
  }, [setNotify]);

  const combinePcStats = () => {
    return {
      totalSpent:
        (pcGameStats?.totalSpent || 0) +
        (pcPlatformStats?.totalSpent || 0) +
        (pcAccStats?.totalSpent || 0) +
        (pcCollStats?.totalSpent || 0),
      totalValue:
        (pcGameStats?.totalValue || 0) +
        (pcPlatformStats?.totalValue || 0) +
        (pcAccStats?.totalValue || 0) +
        (pcCollStats?.totalValue || 0),
      totalDiff:
        (pcGameStats?.totalDiff || 0) +
        (pcPlatformStats?.totalDiff || 0) +
        (pcAccStats?.totalDiff || 0) +
        (pcCollStats?.totalDiff || 0),
      totalCount:
        (pcGameStats?.totalCount || 0) +
        (pcPlatformStats?.totalCount || 0) +
        (pcAccStats?.totalCount || 0) +
        (pcCollStats?.totalCount || 0),
      'Game Totals': {
        spent: pcGameStats?.totalSpent || 0,
        value: pcGameStats?.totalValue || 0,
        diff: pcGameStats?.totalDiff || 0,
        count: pcGameStats?.totalCount || 0
      },
      'Console Totals': {
        spent: pcPlatformStats?.totalSpent || 0,
        value: pcPlatformStats?.totalValue || 0,
        diff: pcPlatformStats?.totalDiff || 0,
        count: pcPlatformStats?.totalCount || 0
      },
      'Accessory Totals': {
        spent: pcAccStats?.totalSpent || 0,
        value: pcAccStats?.totalValue || 0,
        diff: pcAccStats?.totalDiff || 0,
        count: pcAccStats?.totalCount || 0
      },
      'Clone Totals': {
        spent: pcCloneStats?.totalSpent || 0,
        value: pcCloneStats?.totalValue || 0,
        diff: pcCloneStats?.totalDiff || 0,
        count: pcCloneStats?.totalCount || 0
      },
      'Collectibles Totals': {
        spent: pcCollStats?.totalSpent || 0,
        value: pcCollStats?.totalValue || 0,
        diff: pcCollStats?.totalDiff || 0,
        count: pcCollStats?.totalCount || 0
      }
    };
  };

  const itemClicked = useCallback(clicked => {
    console.log('clicked', clicked);
  }, []);

  useEffect(() => {
    getData();
    getExtra();
    // eslint-disable-next-line
  }, [getData, getExtra]);

  return (
    <div className='home'>
      {data && data.physicalVsDigitalGames && (
        <HomeTopTables
          cibGames={data.cibGames}
          totalGames={data.totalGames}
          totalPlatforms={data.totalPlatforms}
          totalAccessories={data.totalAccessories}
          totalClones={data.totalClones}
          consolesByGenerationSorted={data.consolesByGenerationSorted}
          physicalVsDigitalGames={data.physicalVsDigitalGames}
          gamesByDecade={data.gamesByDecade}
          platformCompanies={data.platformCompanies}
          gamesAddedPerYear={data.gamesAddedPerYear}
          everDriveCounts={data.everDriveCounts}
        />
      )}
      {pcGameStats && (
        <div className='price-totals-wrapper'>
          <h3>
            Game Collection Valuation
            {` (Avg Price: ${currencyUtils.formatCurrencyDisplay(pcGameStats.averageValue)})`}
          </h3>
          <div className='home--row'>
            <HomeTopPrices data={pcGameStats} />
          </div>
        </div>
      )}
      {pcPlatformStats && (
        <div className='price-totals-wrapper'>
          <h3>
            Console Collection Valuation
            {` (Avg Price: ${currencyUtils.formatCurrencyDisplay(pcPlatformStats.averageValue)})`}
          </h3>
          <div className='home--row'>
            <HomeTopPrices data={pcPlatformStats} noCounts={true} />
          </div>
        </div>
      )}
      {pcAccStats && (
        <div className='price-totals-wrapper'>
          <h3>
            Accessory Collection Valuation
            {` (Avg Price: ${currencyUtils.formatCurrencyDisplay(pcAccStats.averageValue)})`}
          </h3>
          <div className='home--row'>
            <HomeTopPrices data={pcAccStats} />
          </div>
        </div>
      )}
      {pcCloneStats && (
        <div className='price-totals-wrapper'>
          <h3>
            Clone Collection Valuation
            {` (Avg Price: ${currencyUtils.formatCurrencyDisplay(pcCloneStats.averageValue)})`}
          </h3>
          <div className='home--row'>
            <HomeTopPrices data={pcCloneStats} noCounts={true} />
          </div>
        </div>
      )}
      {pcCollStats && (
        <div className='price-totals-wrapper'>
          <h3>
            Collectibles Valuation
            {` (Avg Price: ${currencyUtils.formatCurrencyDisplay(pcCollStats.averageValue)})`}
          </h3>
          <div className='home--row'>
            <HomeTopPrices data={pcCollStats} noCounts={true} />
          </div>
        </div>
      )}
      {pcPlatformStats && pcGameStats && pcCollStats && pcCloneStats && (
        <div className='price-totals-wrapper'>
          <h3>Total Collection Valuation</h3>
          <div className='home--row'>
            <HomeTopPrices data={combinePcStats()} single={true} />
          </div>
        </div>
      )}
      <div className='home--row'>
        {data && data.mostRecentlyAddedGames && (
          <div className='container-column'>
            <h3>Most Recently Added Games</h3>
            <ListView
              data={data.mostRecentlyAddedGames}
              whichData='createdAt'
              listRowClick={itemClicked}
            />
          </div>
        )}
        {data && data.mostRecentlyAddedPlatforms && (
          <div className='container-column'>
            <h3>Most Recently Added Consoles</h3>
            <ListView
              data={data.mostRecentlyAddedPlatforms}
              whichData='createdAt'
              listRowClick={itemClicked}
              isPlatform={true}
            />
          </div>
        )}
      </div>
      {data && data.gamePerConsoleCounts && (
        <div className='chart-container' style={{ width: '100%' }}>
          <Chart
            type='bar'
            data={ChartService.returnSimpleDataSet(data.gamePerConsoleCounts, 'Games')}
            options={{
              ...chartOptions,
              ...extraChartOptions,
              ...addTitle('Games per platform'),
              ...{ legend: { display: false } }
            }}
            width='100%'
          />
        </div>
      )}
      <div className='home--row'>
        {data && data.mostPaidForGames && (
          <div className='container-column'>
            <h3>Highest Price Paid for Games</h3>
            <ListView
              data={data.mostPaidForGames}
              whichData='pricePaid'
              listRowClick={itemClicked}
            />
          </div>
        )}
        {data && data.mostPaidForPlatforms && (
          <div className='container-column'>
            <h3>Highest Price Paid for Platforms</h3>
            <ListView
              data={data.mostPaidForPlatforms}
              whichData='pricePaid'
              listRowClick={itemClicked}
              isPlatform={true}
            />
          </div>
        )}
      </div>
      <div className='home--row'>
        {highValueGames && (
          <div className='container-column'>
            <h3>Highest Value Games</h3>
            <ListView
              data={highValueGames}
              whichData='priceCharting.price'
              listRowClick={itemClicked}
            />
          </div>
        )}
        {highValuePlatforms && (
          <div className='container-column'>
            <h3>Highest Value Platforms</h3>
            <ListView
              data={highValuePlatforms}
              whichData='priceCharting.price'
              listRowClick={itemClicked}
              isPlatform={true}
            />
          </div>
        )}
      </div>
      {/* {data && data.gamesAcquisition && (
        <div className='chart-container' style={{ width: '100%' }}>
          <Chart
            type='bar'
            data={ChartService.returnSimpleDataSet(
              data.gamesAcquisition,
              'Games per Acquisition Type'
            )}
            options={{
              ...chartOptions,
              ...extraChartOptions,
              ...addTitle('Games per Acquisition Source'),
              ...{ legend: { display: false } }
            }}
            width='100%'
          />
        </div>
      )} */}
      <div className='home--row'>
        <h3>Game collection series data</h3>
        <HomeSeriesSection extraData={extraData} />
        {/* <div className='home-prices'> */}
        {/* <table className='home-prices--table'>
            <thead>
              <tr>
                <th>Series</th>
                <th>Owned</th>
                <th>Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NES Black Box</td>
                <td>{data.nesBBOwned}</td>
                <td>{data.nesBBTotal}</td>
                <td>{getPercent(data.nesBBOwned, data.nesBBTotal)}</td>
              </tr>
              <tr>
                <td>NES Hang Tab</td>
                <td>{data.nesHangTabsGamesOwned}</td>
                <td>{data.nesHangTabTotal}</td>
                <td>{getPercent(data.nesHangTabsGamesOwned, data.nesHangTabTotal)}</td>
              </tr>
              <tr>
                <td>Genesis Black Box Grid</td>
                <td>{data.genesisBBGridOwned}</td>
                <td>{data.genesisBBGridTotal}</td>
                <td>{getPercent(data.genesisBBGridOwned, data.genesisBBGridTotal)}</td>
              </tr>
              {extraData?.ltEx?.length > 0 &&
                extraData.ltEx.map((item: any) => {
                  return (
                    <React.Fragment key={item.con.replace(' ', '-')}>
                      {item?.launchTotal > 0 && (
                        <tr>
                          <td>{`${item.con} Launch Titles`}</td>
                          <td>{item.launchOwned}</td>
                          <td>{item.launchTotal}</td>
                          <td>{getPercent(item.launchOwned, item.launchTotal)}</td>
                        </tr>
                      )}
                      {item.exTotal > 0 && (
                        <tr>
                          <td>{`${item.con} Exclusives`}</td>
                          <td>{item.exOwned}</td>
                          <td>{item.exTotal}</td>
                          <td>{getPercent(item.exOwned, item.exTotal)}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table> */}
        {/* </div> */}
      </div>
      <div className='home--row'>
        {data && data.physicalVsDigitalGames && (
          <div className='chart-container' style={{ width: '50%' }}>
            <Chart
              type='pie'
              data={ChartService.returnSimpleDataSet(
                data.physicalVsDigitalGames,
                'Physical vs Digital Games',
                true
              )}
              options={{
                ...chartOptions,
                ...addTitle('Physical Copy vs Digital Download'),
                ...{ legend: { position: 'bottom', labels: { fontColor: Colors.white } } }
              }}
              width='100%'
              height='500px'
            />
          </div>
        )}
      </div>
      <ScrollToTop position='right' />
    </div>
  );
};

export default Home;
