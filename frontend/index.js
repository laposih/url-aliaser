let url = document.getElementById('url');
let alias = document.getElementById('alias');

let button = document.querySelector('button');
let response = document.getElementsByClassName('response')[0];

button.addEventListener('click', () => {
    let resStatus = '';
    if (url.value != '' && alias.value != '') {
        fetch('http://localhost:3000/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url.value,
                alias: alias.value
            })
        })
            .then((res) => {
                resStatus = res.status
                return res.json()
            })
            .then(res => {
                response.innerHTML = '';
                let responseText = '';
                switch (resStatus) {
                    case 200:
                        response.innerHTML = `Your URL is aliased to <b>${res.alias}</b> and your secret code is <b>${res.secretCode}</b>`
                        response.removeAttribute("class");
                        response.setAttribute("class", "response");
                        url.value = '';
                        alias.value = '';
                        break;
                    case 400:
                        responseText = document.createTextNode(res.message);
                        response.appendChild(responseText);
                        response.setAttribute("class", "error-message");
                        break;
                    default:
                        console.log(`Unhandled error: ${resStatus}, ${res.message}`);
                }
            })
    }
});