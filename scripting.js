window.onload = function() {
  const {
    shell
  } = require('electron')
  const os = require('os');
  const fs = require('fs');
  const {
    dialog
  } = require('electron').remote;
  var encryptionLevel = 1;
  //When encryptOrDecrypt is 1 that means it will encrypt
  //When encryptOrDecrypt is 0 that means it will decrypt
  var encryptOrDecrypt = 1;
  const fileMangerBtn = document.getElementById('file_button');
  const fileMangerDecBtn = document.getElementById('dec_file_button');
  const choiceEasy = document.getElementById('choice_easy');
  const choiceMedium = document.getElementById('choice_medium');
  const choiceHard = document.getElementById('choice_hard');
  fileMangerBtn.addEventListener('click', (event) => {
    encryptOrDecrypt = 1;
    window.setTimeout(openFile, 150);
  })
  fileMangerDecBtn.addEventListener('click', (event) => {
    encryptOrDecrypt = 0;
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
  //This function prompts the user to choose a file for encryption or decryption
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
          if (encryptOrDecrypt) {
            let dataAndKey = encryptData(data, encryptionLevel);
            saveFile(dataAndKey[0], dataAndKey[1]);
          } else {
            //Prompts user to enter decryption key
            const prompt = require('electron-prompt');
            prompt({
              title: 'Enter the decryption key.',
              label: 'KEY:',
              value: '',
              type: 'input'
            }).then((r) => {
              if (r === null) {
                alert('user cancelled');
              } else {
                let decryptedData = decryptData(data, r);
                saveFile(decryptedData, 0);
              }
            }).catch(console.error);
          }
        }
      })
    })
  }
  //Prompts user to choose a file location for the decrypted/encrypted file[s]
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
      if (key != 0) {
        fs.writeFile(filename + "_key", key, (err) => {
          if (err) {
            console.log("An error occured with the creation of the file " + err.message);
            return;
          }
        })
      }

    })

  }
  //Encrypts the chosen file with varying difficulties of user specified encryption
  function encryptData(data, level) {
    var encryptedData = "";
    var encryptionKey = "";
    if (level == 1) {
      let keyLength = 1;
      var key = generateKey(keyLength);
      encryptionKey = "" + key[0];
      for (let i = 0; i < data.length; i++) {
        encryptedData += String.fromCharCode(data[i].charCodeAt(0) + key[0]);
      }
    } else if (level == 2) {
      let keyLength = Math.floor(Math.random() * Math.floor(5)) + 3;
      var key = generateKey(keyLength);
      var index = 0;
      encryptionKey = key.join();
      for (let i = 0; i < data.length; i++) {
        if (index < (key.length - 1)) {
          index++;
        } else {
          index = 0;
        }
        let randomNumber = key[index];
        encryptedData += String.fromCharCode(data[i].charCodeAt(0) + randomNumber);
      }
    } else if (level == 3) {
      let keyLength = data.length;
      var key = generateKey(keyLength);
      var index = 0;
      encryptionKey = key.join();
      for (let i = 0; i < data.length; i++) {
        if (index < (key.length - 1)) {
          index++;
        } else {
          index = 0;
        }
        let randomNumber = key[index];
        encryptedData += String.fromCharCode(data[i].charCodeAt(0) + randomNumber);
      }
    }
    let dataAndKey = [encryptedData, encryptionKey];
    return dataAndKey;
  }
  //Attempts to decrypt the chosen file with a user specified key
  function decryptData(data, key) {
    let keyArray = key.split(",");
    let keyLength = keyArray.length;
    let decryptedData = "";
    var index = 0;
    for (let i = 0; i < data.length; i++) {
      if (index < (keyArray.length - 1)) {
        index++;
      } else {
        index = 0;
      }
      decryptedData += String.fromCharCode(data[i].charCodeAt(0) - keyArray[index]);
    }
    return decryptedData;
  }
  //Generates an encryption key, length varies depending on difficulty
  function generateKey(keyLength) {
    var randomNumber = Math.floor(Math.random() * Math.floor(500)) - 250;
    var key = [randomNumber];
    for (let i = 1; i < keyLength; i++) {
      randomNumber = Math.floor(Math.random() * Math.floor(500)) - 250;
      key.push(randomNumber);
    }
    return key;
  }
}