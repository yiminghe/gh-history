gh-history
============

generate github history from milestones and issues into markdown file.

## Install

	npm install gh-history -g

## Command Line

common usage

	gh-history -u react-component -r calendar -f HISTORY.md

use in basic authentication because of github api [rate limit](https://developer.github.com/v3/#rate-limiting)

	gh-history -u kissyteam -r kissy -f changelog.md -n yourGithubUserName -p yourGithubPassword

or set process.env.GH_USERNAME and process.env.GH_PASSWORD.

## Api

```js
var ghChangeLog = require('gh-changelog');
ghChangeLog.generateHistoryMD({
    user : 'kissyteam',
    repo : 'kissy',
    mdFilePath : './changelog.md',
    loginUserName : 'exampleName',  //optional, or process.env.GH_USERNAME unless you get rate limit error
    loginPassword : 'examplePassword'  //optional, or process.env.GH_PASSWORD unless you get rate limit error
});
```

## Related

npmjs.org/package/gh-changelog
