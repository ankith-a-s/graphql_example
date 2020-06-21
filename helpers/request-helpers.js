const fetch = require('node-fetch')
const BASE_URL = 'http://localhost:4000/v1/';

async function getRequestByURL(relativeURL, authorizationtoken = null) {
  return fetch(`${BASE_URL}${relativeURL}`).then((res) => res.json());
}

async function postRequestByUrl(relativeURL, data, authorizationtoken = null) {
  const res = await fetch(`${BASE_URL}${relativeURL}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      authorizationtoken: authorizationtoken,
      'Content-Type': 'application/json',
    },
  });
  const resJSON = await res.json();
  if (resJSON.success) {
    return resJSON.data;
  } else {
    throw new Error(resJSON.message);
  }
}

module.exports = {
  getRequestByURL,
  postRequestByUrl,
};
