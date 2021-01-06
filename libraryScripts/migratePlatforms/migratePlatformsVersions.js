const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const whitespace = require('stringman').whitespace;
const platforms = require('./basePlatformsNoVersionData.json');
const _find = require('lodash/find');

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
const versionFields = `connectivity,memory,cpu,os,media,name,output,platform_logo.url,platform_logo.image_id,platform_version_release_dates.human,platform_version_release_dates.region,resolutions,storage,summary,output`;
const preferredRegionIds = {
    2: 'North America',
    8: 'Worldwide',
    1: 'Europe',
    5: 'Japan'
};

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

function getReleaseDate(dates) {
    if (!dates) {
        return null;
    } else {
        const regionKeys = Object.keys(preferredRegionIds);
        const ordered = regionKeys.map(key => _find(dates, (d) => d.region == key)).filter(d => d);
        console.log('ordered', ordered);
        if (ordered && ordered.length > 0) {
            return {date: ordered[0].human, region: preferredRegionIds[ordered[0].region]};
        } else {
            return null;
        }
    }
}

async function getNewData(platform) {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow('platform', JSON.stringify(platform, null, 2)));
        if (platform.versions && platform.versions.length) {
            const data = `fields ${versionFields};where id = ${platform.versions[0].id};`;
            const headers = makeHeaders(appKey);
            axios({
                url: `https://api.igdb.com/v4/platform_versions`,
                method: 'POST',
                headers,
                data
            })
                .then((result) => {
                    // console.log(chalk.green('result', JSON.stringify(result.data, null, 2)));
                    if (result.status === 200) {
                        const item = result.data[0];
                        const formatted = {};
                        formatted.cpu = item.cpu ? item.cpu : null;
                        formatted.media = item.media ? item.media : null;
                        formatted.memory = item.memory ? item.memory : null;
                        formatted.output = item.output ? item.output : null;
                        formatted.os = item.os ? item.os : null;
                        formatted.logo = item.platform_logo && item.platform_logo.image_id ? item.platform_logo.image_id : null;
                        formatted.connectivity = item.connectivity ? item.connectivity : null;
                        formatted.releaseDate = item.platform_version_release_dates;
                        const combined = { ...platform, ...formatted };
                        resolve(combined);
                    } else {
                        reject({ platform, result });
                    }
                })
                .catch(error => {
                    console.log(chalk.red(platform.name));
                    console.log(chalk.blue(error));
                    resolve({ platform, error });
                })
        } else {
            resolve({ platform, error: 'NOT A VALID PLATFORM ID TO LOOKUP' });
        }
    });
}

function handleResults(results) {
    // console.log('results', results);
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

        const throttled = async () => {
            const pLast = promiseArr.length - 1;
            for (let i = 0; i < promiseArr.length; i++) {
                wait = 1000 * (i + 1);
                await setTimeout(() => {
                    promiseArr[i]
                        .then((result) => {
                            // console.log('result', JSON.stringify(result, null, 2));
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