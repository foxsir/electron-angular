const { dialog } = require('electron')
dialog.showOpenDialog({ properties: ['openDirectory'] }).then(dir => {
  console.dir(dir);
});
