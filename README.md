# Games Library

Basically my game collection is at a point where a games library manager is needed. I built a basic version of this in Vue a while back in a private repo. Now I'm going to build it in React because I'm new to React and add a different feature set. Basically, I want to be able to quickly filter down games to help my decide what to play based on how many people are playing with me and what genres we are in the mood for.

I intentionally made some questionable decisions to force myself to use different parts of React and experiment with different scenarios. For example, the DatTable.tsx file should have the colum data passed in props to keep the component dumb. Instead, I'm using state and hitting a method to get them to force myself to think about state and re-rendering.

## Plans

As this has grown, I've decided it should become something I launch with user logins, etc. It will eventually because closed source for this reason. Below are some things I will end up doing to it to get it ready for that transition.

- better filters in Decider section.
- more charts in Viz section.
- figure out home screen. Current home screen is experiment and I decided most of it is best suited for Viz. Maybe just some lists?
- add section to add to collection. Currently I do this in another app of mine in a private repo then import the results.
- add ability to import collection from common games collections apps like GameEye.
- add ability to export to json and csv
- refactor to use only IGDB data. The fact that it uses IGDB and GB data is a matter of me wanting ALL THE DATA and having the original app in a private repo where I knew it wouldn't be an issue.
- add eBay support like I did in my gs-scraper app
- refactor to move as much data manipulation to backend as possible.
- rewrite backend. This backend is from another project and is OLD. I just copy-pasta'd it over to here because the backend was not meant to be my focus but just something I needed ASAP.
- make it all less ugly. Very little time has been spent on design. The focus was learning React and creating something useful for myself.
- auth system
- move backend to DB (mongo or a SQL, I should think about this before doing it)
- create landing page and common pages via Gatsby for SEO purposes, then build actual app dynamically. Will probably create monorepo with component and style library to do this.
- use a payment processor (probably Stripe)
- once the above is done, buy a domain and host it

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

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

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
