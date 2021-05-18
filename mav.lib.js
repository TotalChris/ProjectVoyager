const fs = require('fs');
let cd = '';

function navigate(path) { //use an onclick here
    let fileList = document.querySelector('#filelist');
    let pathbox = document.querySelector('#pathbox');
    while (fileList.firstChild) {
        fileList.removeChild(fileList.firstChild);
    }
    fs.readdirSync(cd + path, {withFileTypes: true}).forEach((entry) => {
        fileList.appendChild(new MItem(entry.name));
    });
    cd = cd + path;
    pathbox.value = cd;
}
module.exports = { navigate, cd }