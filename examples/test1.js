var ghHistory = require('../index');
var path = require('path');

ghHistory.generateHistoryMD({
  user: 'kissyteam',
  repo: 'xtemplate',
  mdFilePath: path.join(__dirname,'./HISTORY.md')
});