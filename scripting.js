window.onload = function() {
   const {shell} = require('electron')
   const os = require('os')

   const fileMangerBtn = document.getElementById('file_button')

   fileMangerBtn.addEventListener('click', (event) => {
     shell.showItemInFolder(os.homedir())
   })
}
