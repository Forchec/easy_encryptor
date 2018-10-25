window.onload = function() {
  const {
    shell
  } = require('electron')
  const os = require('os')
  const fs = require('fs');
  const {
    dialog
  } = require('electron').remote;
  var encryptionLevel = 1;
  const fileMangerBtn = document.getElementById('file_button');
  const choiceEasy = document.getElementById('choice_easy');
  const choiceMedium = document.getElementById('choice_medium');
  const choiceHard = document.getElementById('choice_hard');
  fileMangerBtn.addEventListener('click', (event) => {
    window.setTimeout(openFile, 150);
  })
  choiceEasy.addEventListener('click', (event) => {
    choiceEasy.style.backgroundColor = "#0074D9";
    choiceMedium.style.backgroundColor = "#7FDBFF";
    choiceHard.style.backgroundColor = "#7FDBFF";
    encryptionLevel = 1;
  })
  choiceMedium.addEventListener('click', (event) => {
    choiceEasy.style.backgroundColor = "#7FDBFF";
    choiceMedium.style.backgroundColor = "#0074D9";
    choiceHard.style.backgroundColor = "#7FDBFF";
    encryptionLevel = 2;
  })
  choiceHard.addEventListener('click', (event) => {
    choiceEasy.style.backgroundColor = "#7FDBFF";
    choiceMedium.style.backgroundColor = "#7FDBFF";
    choiceHard.style.backgroundColor = "#0074D9";
    encryptionLevel = 3;
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
          let dataAndKey = encryptData(data, encryptionLevel);
          saveFile(dataAndKey[0], dataAndKey[1]);
        }
      })
    })
  }

  function saveFile(content, key) {
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
      fs.writeFile(filename + "_key", key, (err) => {
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
      var keyLength = Math.floor(Math.random() * Math.floor(5)) + 3;
      var key = generateKey(keyLength);
      var index = 0;
      for (let i = 0; i < data.length; i++) {
        if (index < (key.length - 1)) {
          index++;
        } else {
          index = 0;
        }
        var randomNumber = key[index];
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
    } else if (level == 3) {
      var keyLength = data.length;
      var key = generateKey(keyLength);
      for (let i = 0; i < data.length; i++) {
        var randomNumber = key[i];
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
    let dataAndKey = [encryptedData, encryptionKey];
    return dataAndKey;
  }

  function generateKey(keyLength) {
    var randomNumber = Math.floor(Math.random() * Math.floor(40)) - 20;
    var key = [randomNumber];
    for (let i = 1; i < keyLength; i++) {
      randomNumber = Math.floor(Math.random() * Math.floor(40)) - 20;
      key.push(randomNumber);
    }
    return key;
  }
}