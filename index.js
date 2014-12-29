var request = require('request');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var escapeHtml = require('escape-html');
var semver = require('semver');

function clone(obj) {
  var ret = {};
  for (var key in obj) {
    ret[key] = obj[key];
  }
  return ret;
}

function generateHistoryMD(cfg) {
  if (!cfg.user || !cfg.repo) {
    console.log('You must provide user and repo argument...');
    return;
  }
  cfg.loginUserName = cfg.loginUserName || process.env.GH_USERNAME;
  cfg.loginPassword = cfg.loginPassword || process.env.GH_PASSWORD;
  console.log('Task is running, please wait for a moment...');
  getMileStones(clone(cfg), getIssuesFromAllMileStones);
}

function getMileStones(opts, callback) {
  if (opts.loginUserName && opts.loginPassword) {
    var basic = new Buffer(opts.loginUserName + ':' + opts.loginPassword).toString('base64');
    opts.headers = {
      accept: 'application/vnd.github.beta+json',
      authorization: 'Basic ' + basic,
      host: 'api.github.com',
      'user-agent': 'NodeJS HTTP Client'
    };
  } else {
    console.log('you didn\'t provide your username and password on github, once you get a "rate limit" error, you must provide them.');
    opts.headers = {
      'user-agent': 'NodeJS HTTP Client'
    }
  }
  opts.url = 'https://api.github.com/repos/' + opts.user + '/' + opts.repo + '/milestones?state=all';
  console.log('start to request milestones');
  request.get(opts, function (err, res, body) {
    console.log('complete to request milestones');
    if (!err && res.statusCode === 200) {
      callback(opts, JSON.parse(body));
    } else {
      console.log(body);
    }
  });
}

function getIssuesFromAllMileStones(opts, allMileStones) {
  if (!allMileStones.length) {
    console.log('This repotory has no milestone...');
    return;
  }
  var histories = [];
  allMileStones.forEach(function (milestone) {
    var number = milestone.number;
    var milestoneData = {milestone: milestone};
    opts.url = 'https://api.github.com/repos/' + opts.user + '/' + opts.repo + '/issues?state=all&milestone=' + number;
    console.log('start to request issues from milestone ' + number);
    request(opts, function (err, res, body) {
      console.log('complete to request issues from milestone ' + number);
      if (!err && res.statusCode == 200) {
        console.log('ok');
        milestoneData.issues = JSON.parse(body);
        histories.push(milestoneData);
        if (histories.length === allMileStones.length) {
          histories.sort(function (milestoneData_1, milestoneData_2) {
            return semver.lt(milestoneData_1.milestone.title.trim(), milestoneData_2.milestone.title.trim()) ? 1 : -1;
          });
          createMDFile(opts, histories);
        }
      } else {
        console.log(err);
        console.log(body);
      }
    });
  });
}

function createMDFile(opts, histories) {
  var mdFilePath = path.resolve(opts.mdFilePath);
  var mdContent = ['# History', '----', ''];
  mdContent = mdContent.concat(histories.map(function (h) {
    return getSingleHistory(h);
  }));
  mkdirp(path.dirname(mdFilePath));
  fs.writeFileSync(mdFilePath, mdContent.join('\n'));
  console.log(mdFilePath + ' was created..');
}

function getSingleHistory(h) {
  var milestone = h.milestone;
  var issues = h.issues;
  var itemContent = [];
  itemContent.push('## ' + escapeHtml(milestone.title) + ' / ' + milestone.created_at.substring(0, 10));
  itemContent.push('');
  itemContent = itemContent.concat(issues.map(function (issueItem) {
    var labels = issueItem.labels;
    var labelsStr = '';
    if (labels && labels.length) {
      labelsStr = labels.map(function (l) {
        return '`' + l.name + '`';
      }).join(' ') + ' ';
    }
    return labelsStr + '[\#' + issueItem.number + '](' + issueItem.html_url + ') ' + escapeHtml(issueItem.title) + '   ([@' + issueItem.user.login + '](' + issueItem.user.html_url + '))\n';

  }));
  return itemContent.join('\n');
}

module.exports = {
  generateHistoryMD: generateHistoryMD
};