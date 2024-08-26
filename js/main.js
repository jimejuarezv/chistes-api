document.getElementById('getJoke').addEventListener('click', function() {
    // Obtener los valores de los filtros
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const lang = document.getElementById('lang').value;

    const blacklistFlags = [];
    if (document.getElementById('blacklistReligion').checked) blacklistFlags.push('religion');
    if (document.getElementById('blacklistPolitics').checked) blacklistFlags.push('politics');
    if (document.getElementById('blacklistSex').checked) blacklistFlags.push('sex');
    if (document.getElementById('blacklistDrugs').checked) blacklistFlags.push('drugs');
    if (document.getElementById('blacklistExplicit').checked) blacklistFlags.push('explicit');

    // Construir la URL de la API con los filtros
    const url = new URL('https://v2.jokeapi.dev/joke/' + category);
    url.searchParams.append('type', type);
    url.searchParams.append('lang', lang);
    if (blacklistFlags.length > 0) {
        url.searchParams.append('blacklistFlags', blacklistFlags.join(','));
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const jokeElement = document.getElementById('joke');
            if (data.type === 'single') {
                jokeElement.textContent = data.joke;
                jokeElement.dataset.joke = data.joke; // Store original joke
            } else if (data.type === 'twopart') {
                jokeElement.textContent = `${data.setup} - ${data.delivery}`;
                jokeElement.dataset.joke = `${data.setup} - ${data.delivery}`; // Store original joke
            } else {
                jokeElement.textContent = 'No joke found';
                jokeElement.dataset.joke = ''; // Clear original joke
            }
        })
        .catch(error => {
            console.error('Error fetching joke:', error);
        });
});

document.getElementById('translateJoke').addEventListener('click', function() {
    const jokeElement = document.getElementById('joke');
    const joke = jokeElement.dataset.joke;

    if (joke) {
        // Translate to Spanish
        translate(joke, 'es').then(translatedJoke => {
            jokeElement.textContent = translatedJoke;
        }).catch(error => {
            console.error('Error translating joke:', error);
        });
    } else {
        alert('Please fetch a joke first.');
    }
});

function translate(text, targetLanguage) {
    return new Promise((resolve, reject) => {
        window['google-translate-api'].translate(text, { to: targetLanguage })
            .then(response => resolve(response.text))
            .catch(error => reject(error));
    });
}
