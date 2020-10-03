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
  consolesByCompany: INumIndex;
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
  consolesByCompany,
  gamesAddedPerYear
}) => {
  return (
    <div className="home--row totals-tables">
      <div>
        <h3>Totals</h3>
        <table className="totals">
          <thead>
            <th>Category</th>
            <th>Quantity</th>
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
        <table>
          <thead>
            <th>Decade</th>
            <th>Quantity</th>
          </thead>
          <tbody>
            {Object.keys(gamesByDecade).map(decade => (
              <tr>
                <td>{`${decade}'s`}</td>
                <td>{gamesByDecade[decade]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Consoles by Generation</h3>
        <table>
          <thead>
            <th>Generation</th>
            <th>Quantity</th>
          </thead>
          <tbody>
            {Object.keys(consolesByGenerationSorted).map(gen => (
              <tr>
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
        <h3>Consoles per Manufacturer</h3>
        <table>
          <thead>
            <th>Company</th>
            <th>Quantity</th>
          </thead>
          <tbody>
            {Object.keys(consolesByCompany).map(company => (
              <tr>
                <td>{company}</td>
                <td>{(consolesByCompany as INumIndex)[company]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Games Added per Year</h3>
        <table>
          <thead>
            <th>Year</th>
            <th>Games Added</th>
          </thead>
          <tbody>
            {gamesAddedPerYear.map(year => (
              <tr>
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
