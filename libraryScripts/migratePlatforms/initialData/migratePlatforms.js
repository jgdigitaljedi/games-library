const games = require('../../../server/db/games.json');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const whitespace = require('stringman').whitespace;
const platforms = require('./consoles.json');

const categories = {
    1: 'console',
    2: 'arcade',
    3: 'platform',
    4: 'operating system',
    5: 'portable console',
    6: 'computer'
};

/**
 * platform call will get...

 name
 alternative_name
 generation
 category
 versions
 */

/**
 * then, use version to make platform_versions call and get...
 * connectivity
 * main_manufacturer.company
 * media
 * name
 * output
 * platform_logo.url
 * platform_logo.image_id
 * platform_version_release_dates.date
 * resolution
 * storage
 * summary
 * */

/**
 * then, store the chosen result flat like this...
 * name
 * alternative_name
 * id
 * generation
 * category
 * version // version name
 * company // main_manufacturer.company
 * versionName // version.name
 * media
 * output
 * logoId
 * logoUrl
 * releaseDate
 * resolution
 * storage
 * summary
 * condition // user props start here
 * box
 * manual
 * mods
 * notes
 * datePurchased
 * purchasePrice
 * ghostConsole
 * createdAt
 * updatedAt
 * _id
 * howAcquired
 * */
let appKey;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchSecretToken = process.env.TWITCH_SECRET_TOKEN;
const platformFields = `name,alternative_name,generation,category,versions,versions.name`;
const versionFields = `connectivity,main_manufacturer.company,media,name,output,platform_logo,platform_logo.image_id,platform_version_release_dates.date,resolution,storage,summary`;

async function getAppAccessToken() {
    return axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchSecretToken}&grant_type=client_credentials`
    );
}

function makeHeaders(key) {
    return {
        Accept: 'application/json',
        'Client-ID': twitchClientId,
        Authorization: `Bearer ${key.access_token}`
    };
}

async function refreshAppKey() {
    const appKeyRes = await getAppAccessToken();
    appKey = appKeyRes.data;
}

function getUserData(platform) {
    const oldData = {
        condition: platform.condition,
        box: platform.box,
        manual: false,
        mods: platform.mods,
        notes: platform.notes,
        datePurchased: platform.datePurchased ? moment(platform.datePurchased, 'YYYY-MM-DD').format('MM/DD/YYYY') : null,
        pricePaid: platform.purchasePrice ? parseFloat(platform.purchasePrice) : null,
        ghostConsole: platform.ghostConsole,
        createdAt: platform.createdAt,
        _id: platform._id,
        howAcquired: platform.howAcquired,
        updatedAt: moment().format('MM/DD/YYYY hh:mm a')
    };
    return oldData;
}

async function getNewData(platform) {
    return new Promise((resolve, reject) => {
        if (platform.igdb && platform.igdb.id && platform.igdb.id !== 9999 && platform.igdb.id !== 99999) {
            const data = `fields ${platformFields};where id = ${platform.igdb.id};`;
            const headers = makeHeaders(appKey);
            axios({
                url: `https://api.igdb.com/v4/platforms`,
                method: 'POST',
                headers,
                data
            })
                .then((result) => {
                    console.log(chalk.green('result', JSON.stringify(result.data, null, 2)));
                    if (result.status === 200) {
                        const userData = getUserData(platform);
                        const item = { ...result.data[0], ...userData};
                        item.category = categories[item.category];
                        resolve(item);
                    } else {
                        reject({ platform, result });
                    }
                })
                .catch(error => {
                    console.log(chalk.red(platform.igdb.name));
                    console.log(chalk.blue(error));
                    resolve({ platform, error });
                })
        } else {
            resolve({ platform, error: 'NOT A VALID PLATFORM ID TO LOOKUP' });
        }
    });
}

function handleResults(results) {
    console.log('results', results);
    const cleaned = [],
        errors = [];
    results.forEach((result) => {
        if (result.error) {
            errors.push(result);
        } else {
            cleaned.push(result);
        }
    });

    // write results
    fs.writeFile(
        path.join(__dirname, `platformResults.json`),
        JSON.stringify(cleaned, null, 2),
        (err) => {
            if (err) {
                err.forEach((error) => {
                    console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
                });
            }
        }
    );

    // write errors to another file so I can address them later
    fs.writeFile(
        path.join(__dirname, `platformErrors.json`),
        JSON.stringify(errors, null, 2),
        (err) => {
            if (err) {
                err.forEach((error) => {
                    console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
                });
            }
        }
    );
}

refreshAppKey()
    .then(() => {
        const promiseArr = platforms.map((g) => getNewData(g));
        const final = [];
        const errors = [];
        let wait = 1000;

        console.log(chalk.magenta('ABOUT TO START'));
        const throttled = async () => {
            const pLast = promiseArr.length - 1;
            for (let i = 0; i < promiseArr.length; i++) {
                wait = 1000 * (i + 1);
                await setTimeout(() => {
                    promiseArr[i]
                        .then((result) => {
                            console.log('result', JSON.stringify(result, null, 2));
                            final.push(result);
                            if (pLast === i) {
                                handleResults([...final, ...errors]);
                            }
                        })
                        .catch((error) => {
                            console.log(chalk.red(error));
                            errors.push(error);
                            if (pLast === i) {
                                handleResults([...final, ...errors]);
                            }
                        });
                }, wait);
            }
        };

        (async () => {
            await throttled();
        })();
    })
    .catch((errors) => {
        console.log(chalk.red.bold(JSON.stringify(errors, null, 2)));
    });