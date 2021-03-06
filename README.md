[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commitlogoColor=white)](https://github.com/pre-commit/pre-commit)

---
<p align="center">
	<a href="https://portal.gdc.cancer.gov/">
		<img src="http://i.imgur.com/b6arSwT.png" width="456" alt="GDC Data Portal">
	</a>
</p>
<p align="center">
  <b>#react #relay #redux #recompose #flow #jest #d3</b>
</p>
<p align="center">
	<a href="https://travis-ci.org/NCI-GDC/portal-ui">
		<img src="https://travis-ci.org/NCI-GDC/portal-ui.svg?branch=next"
			 alt="Build Status">
	</a>
</p>

- [Technologies](#technologies)
- [Installation](#installation)
- [Tests](#tests)
- [Development](#development)
- [Contributing](#contributing)

## Technologies

- [React](https://facebook.github.io/react/) - JavaScript library for building user interfaces
- [Relay](https://facebook.github.io/relay/) - JavaScript framework for building data-driven React applications
- [Redux](http://redux.js.org/) - Predictable state container for JavaScript apps
- [Recompose](https://github.com/acdlite/recompose) - React utility belt for function components and higher-order components
- [Flow](https://flow.org/) - Static type checker for JavaScript
- [Jest](https://facebook.github.io/jest/) - Delightful JavaScript testing
- [d3](https://d3js.org/) - Data-Driven Documents

<!--ts-->
      * [Technologies](#technologies)
      * [Installation](#installation)
      * [Tests](#tests)
      * [Development](#development)
      * [Setup pre-commit hook to check for secrets](#setup-pre-commit-hook-to-check-for-secrets)
      * [Contributing](#contributing)

<!-- Added by: qiaoqiao, at: Tue Jul 21 11:32:07 CDT 2020 -->

<!--te-->
## Installation

Install Watchman

```
brew update
brew install watchman
```

We recommend using **Node v8 (npm v5)**.

```
npm i
```

## Tests

```
npm test
```

<img src="http://i.imgur.com/SBplvwn.png" />

## Development

By default the portal will attempt to connect to an api instance running on `localhost:5000`, however this can changed by setting the environment variable `REACT_APP_API`, or by setting `localStorage.REACT_APP_API` in the browser.

```
# start ui connected to localhost:5000 api server
npm start

# start ui connected to UChicago api server
REACT_APP_API=https://api.gdc.cancer.gov/v0/ npm start

// change api url during runtime in browser
localStorage.REACT_APP_API = 'https://api.gdc.cancer.gov/v0/'
```

<img src="http://i.imgur.com/5dQYvoW.png" />


    
## Setup pre-commit hook to check for secrets

We use [pre-commit](https://pre-commit.com/) to setup pre-commit hooks for this repo.
We use [detect-secrets](https://github.com/Yelp/detect-secrets) to search for secrets being committed into the repo. 

To install the pre-commit hook, run
```
pre-commit install
```

To update the .secrets.baseline file run
```
detect-secrets scan --update .secrets.baseline
```

`.secrets.baseline` contains all the string that were caught by detect-secrets but are not stored in plain text. Audit the baseline to view the secrets . 

```
detect-secrets audit .secrets.baseline
```


## Contributing

Read how to contribute [here](CONTRIBUTING.md)
