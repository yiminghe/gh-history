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
var ghHistory = require('gh-history');
ghHistory.generateHistoryMD({
    user : 'kissyteam',
    repo : 'kissy',
    mdFilePath : './HISTORY.md',
    loginUserName : 'exampleName',  //optional, or process.env.GH_USERNAME unless you get rate limit error
    loginPassword : 'examplePassword'  //optional, or process.env.GH_PASSWORD unless you get rate limit error
});
```

## Example

xtemplate milestones and issues: https://github.com/kissyteam/xtemplate/milestones?state=closed

xtemplate HISTORY.md: https://github.com/kissyteam/xtemplate/blob/master/HISTORY.md

xtemplate history at spm: http://spmjs.io/docs/xtemplate/history.html

## Related

npmjs.org/package/gh-changelog
