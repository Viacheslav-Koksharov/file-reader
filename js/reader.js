const button = document.getElementById('file');
button.addEventListener('change', handleFile);

if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFile(evt) {
    const file = evt.target.files[0];

    if (!file.type.match('text.*')) {
        return alert(`${file.name} is not a valid text file.`);
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = handleData;
}

function handleData() {
    const REGEX = /(\r\n|\n|\r)/gm;
    let passwordsCount = 0;
    let message = '';

    const fileData = this.result.replace(REGEX, ",").split(",");
    const normalizedData = getNormalizedData(fileData);
    passwordsCount += getPasswordsCount(normalizedData);
    message = `Number of valid passwords: ${passwordsCount}`;
    getTextElement(button, message);
};

function getNormalizedData(data) {
    const normalizedData = [];

    for (let el of data) {
        const normalizedEl = el.split(' ').join(',').replace(/[:]/g, '').replace(/[-]/g, ',');
        normalizedData.push(normalizedEl);
    }
    return normalizedData;
}

function getPasswordsCount(data) {
    let passwordsCount = 0;

    for (const el of data) {
        const arr = el.split(',');
        const char = arr[0];
        const min = arr[1];
        const max = arr[2];
        const password = arr[3];
        let symbolsCount = getSymbolsCount(char, password);

        if (symbolsCount >= min && symbolsCount <= max) {
            passwordsCount += 1;
        }
    }
    return passwordsCount;
}

function getSymbolsCount(char, password) {
    if (password) {
        let counter = 0;

        for (let i = 0; i < password.length; i += 1) {
            if (password[i] === char) counter += 1;
        }
        return counter;
    }
}

function getTextElement(el, message) {
    const text = document.createElement("p");
    text.classList.add("message");
    text.textContent = message;
    el.after(text);
}
