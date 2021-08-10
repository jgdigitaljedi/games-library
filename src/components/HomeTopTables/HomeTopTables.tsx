import React, { FunctionComponent } from 'react';
import { consoleGenerationYears, consoleGenerationNames } from '../../services/helpers.service';
import './HomeTopTables.scss';

interface INumIndex {
  [key: string]: number;
}

interface IDateRelated {
  dateFormatted: string;
  games: number;
}

interface IProps {
  consolesByGenerationSorted: INumIndex;
  gamesByDecade: INumIndex;
  totalGames: number;
  totalPlatforms: number;
  totalAccessories: number;
  totalClones: number;
  cibGames: number;
  physicalVsDigitalGames: INumIndex;
  platformCompanies: INumIndex;
  gamesAddedPerYear: IDateRelated[];
}

interface IStringIndex {
  [key: string]: string;
}

const HomeTopTables: FunctionComponent<IProps> = ({
  totalGames,
  cibGames,
  physicalVsDigitalGames,
  totalPlatforms,
  totalAccessories,
  totalClones,
  gamesByDecade,
  consolesByGenerationSorted,
  platformCompanies,
  gamesAddedPerYear
}) => {
  return (
    <div className='home--row totals-tables'>
      <div>
        <h3>Totals</h3>
        <table className='totals'>
          <thead>
            <tr>
              <th>Category</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Games</td>
              <td>{totalGames}</td>
            </tr>
            <tr>
              <td>CIB Games</td>
              <td>{cibGames}</td>
            </tr>
            <tr>
              <td>Physical Games</td>
              <td>{physicalVsDigitalGames.physical}</td>
            </tr>
            <tr>
              <td>Digital Games</td>
              <td>{physicalVsDigitalGames.digital}</td>
            </tr>
            <tr>
              <td>Platforms</td>
              <td>{totalPlatforms}</td>
            </tr>
            <tr>
              <td>Accessories</td>
              <td>{totalAccessories}</td>
            </tr>
            <tr>
              <td>Clones</td>
              <td>{totalClones}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h3>Games per Decade</h3>
        <table className='totals'>
          <thead>
            <tr>
              <th>Decade</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(gamesByDecade).map((decade, index) => (
              <tr key={`decade-row-${index}`}>
                <td>{`${decade}'s`}</td>
                <td>{gamesByDecade[decade]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Consoles by Generation</h3>
        <table className='totals'>
          <thead>
            <tr>
              <th>Generation</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(consolesByGenerationSorted).map((gen, index) => (
              <tr key={`gen-row-${index}`}>
                <td>{`${(consoleGenerationNames as IStringIndex)[gen]} (${
                  (consoleGenerationYears as IStringIndex)[gen]
                })`}</td>
                <td>{(consolesByGenerationSorted as INumIndex)[gen]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Platforms by Company</h3>
        <table className='totals'>
          <thead>
            <tr>
              <th>Company</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(platformCompanies).map((company, index) => (
              <tr key={`company-row-${index}`}>
                <td>{company}</td>
                <td>{(platformCompanies as INumIndex)[company]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Games Added per Year</h3>
        <table className='totals'>
          <thead>
            <tr>
              <th>Year</th>
              <th>Games Added</th>
            </tr>
          </thead>
          <tbody>
            {gamesAddedPerYear.map((year, index) => (
              <tr key={`year-row-${index}`}>
                <td>{year.dateFormatted}</td>
                <td>{year.games}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeTopTables;
