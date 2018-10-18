window.onload = function() {
  const {
    shell
  } = require('electron')
  const os = require('os')
  const fs = require('fs');
  const {
    dialog
  } = require('electron').remote;
  const fileMangerBtn = document.getElementById('file_button')

  fileMangerBtn.addEventListener('click', (event) => {
    window.setTimeout(openFile, 150);
  })

  function openFile() {
    dialog.showOpenDialog((fileNames) => {
      if (fileNames === undefined) {
        console.log("No files were selected");
        return;
      }

      fs.readFile(fileNames[0], "utf-8", (err, data) => {
        if (err) {
          console.log("Cannot read file ", err);
          return;
        } else {
          data = encryptData(data, 1);
          saveFile(data);
        }
      })
    })
  }

  function saveFile(content) {
    dialog.showSaveDialog((filename) => {
      if (filename === undefined) {
        console.log("The user clicked the button but didn't create a file.");
        return;
      }

      fs.writeFile(filename, content, (err) => {
        if (err) {
          console.log("An error occured with the creation of the file " + err.message);
          return;
        }
      })
    })
  }

  function encryptData(data, level) {
    var encryptedData = "";
    var encryptionKey = "";
    if (level == 1) {
      for (let i = 0; i < data.length; i++) {
        encryptedData += String.fromCharCode(data[i].charCodeAt(0) + 1);
        encryptionKey += "1 ";
      }
    } else if (level == 2) {
      for (let i = 0; i < data.length; i++) {
        var randomNumber = Math.floor(Math.random() * Math.floor(50)) - 25;
        if ((data[i].charCodeAt(0) + randomNumber) < 127 &&
          (data[i].charCodeAt(0) + randomNumber) > -127 &&
          (data[i].charCodeAt(0) + randomNumber) != 0) {
          encryptedData += String.fromCharCode(data[i].charCodeAt(0) + randomNumber);
          encryptionKey += randomNumber + " ";
        } else {
          encryptedData += data[i];
          encryptionKey += "0 ";
        }
      }
    }
    encryptedData += "\n\n\nKEY: ";
    encryptedData += encryptionKey;
    return encryptedData;
  }

}