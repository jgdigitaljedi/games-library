# Games Library

This started as my first React app since I had already built a version of this in Vue and could just steal my own backend and scripts and worry about the GUI. It became something I actually deploy to a raspberry pi on my home network and use.

Also, it has become a fast-and-loose mess. That's somewhat intentional as I'd rather sling out a new feature than think too  much about composition and best practices right now. I do that enough at my day job. I am, however, cleaning things up slowly at this point because, now that I've worked professionally in React for a while, I'm starting to really get used to things being tidy.

## Immediate plans

1. redo data structure of games and consoles to remove GB and use more IGDB data and none of GB

   - make sure games data structure includes an area for `containsGames` which can be used to list which games are in a compilation
   - make console names consistent between project data

2. add route that will have forms for adding new things to collection
3. adjust views to represent new data structure
4. use `containsGames` to update my library with compilation game data
5. make backend processing scripts happen everytime there is a new game added, deleted, edited, etc (probably should make the scripts more modular so the whole library doesn't get processed in one shot)

- add toggle in Decider to allow for expanding games in compiltations to game cards so they are searchable, filterable, etc

Once the above is done, I will be moving into a new repo to rebuild using what I learned about React during this time to make something better.

## Plans

- more charts in Viz section.
- add section to add to collection. Currently I do this in another app of mine in a private repo then import the results.
- add ability to import collection from common games collections apps like GameEye.
- add ability to export to json and csv
- refactor to use only IGDB data. The fact that it uses IGDB and GB data is a matter of me wanting ALL THE DATA and having the original app in a private repo where I knew it wouldn't be an issue.
- add eBay support like I did in my gs-scraper app
- refactor to move as much data manipulation to backend as possible.
- rewrite backend. This backend is from another project and is OLD. I just copy-pasta'd it over to here because the backend was not meant to be my focus but just something I needed ASAP. It also won't scale as it was a quick-and-dirty solution that would always handle my collection but would be a resource hog if there were potentially thousands of people's collections.
- make it all less ugly. Very little time has been spent on design. The focus was learning React and creating something useful for myself.
- auth system
- move backend to DB (mongo or a SQL, I should think about this before doing it)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Also runs node server at port 4000.<br />
Open [http://localhost:3000](http:// localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

First, add this to package.json `"homepage": "http://ghome.help/gameslib",`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
