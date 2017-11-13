import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records?"; 

// Your retrieve function plus any additional functions go here ...
const isPrimaryColor = (color) => {
  return ["red", "blue", "yellow"].includes(color);
}

const transform = (payload, page) => {
  console.log("Transforming!!")
  console.log("payload: " + payload);
  console.log("payload page: " + page);
  const previousPage = page && page > 1 ? page - 1 : null;
  const nextPage = payload.length > 10 ? page + 1 : null;
  console.log("previous page: " + previousPage);
  console.log("next page: " + nextPage);

  if (payload.length > 10) {
    payload.pop();
  }

  const ids = payload.map(item => item.id);

  const open = payload
    .filter(item => item.disposition == "open")
    .map(item => {
      item.isPrimary = isPrimaryColor(item.color);
      return item;
    });

  const closedPrimaryCount = payload
    .filter(item => item.disposition == "closed")
    .reduce((total, item) => isPrimaryColor(item.color) ? total + 1 : total, 0);

  let result = { previousPage, nextPage, ids, open, closedPrimaryCount };
  console.log(result);
  return { previousPage, nextPage, ids, open, closedPrimaryCount };
}

const retrieve = (options = {}) => { 
    let optionzzz = options
    const page = options.page || 1;

    const toQueryString = (object, base) => {
        let queryString = [];

        Object.keys(object).forEach((key) => {

            let result,
                value;

            value = object[key];

            if (base) {
                key = base + '[]';
            }
            switch (typeof value) {
                case 'object': 
                    result = toQueryString(value, key); 
                    break;
                 default: 
                    result = key + '=' + encodeURIComponent(value);
            }

            if (value != null) {
                if (key == 'page'){
                    result = key.replace(/page/i, 'offset') + '=' + encodeURIComponent((value - 1) * 10);
                }
                if (key == 'colors[]'){
                    result = key.replace(/colors/i, 'color') + '=' + encodeURIComponent((value));
                }
                
                queryString.push(result);
            }
        });
        return queryString.join('&');
    };

    let uri = new URI(window.path + 'limit=11&' + toQueryString(optionzzz));

    fetch(uri)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject('Oh No! Something went wrong!')
        }
      })
      .then(data => {
        console.log("this is the uri: " + uri)
        transform(data, page);
      })
      .catch(error => console.log('Peep this error: ', error));


};


export default retrieve;
