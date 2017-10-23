import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records?"; 

// Your retrieve function plus any additional functions go here ...
const retrieve = (options) => { 
    let optionzzz = options


    const toQueryString = (object, base) => {
        let queryString = [];

        Object.keys(object).forEach((key) => {
            console.log('object: ' + object);
            console.log('keys: ' + key);

            let result,
                value;

            value = object[key];
            console.log('value: ' + value);

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

    

    let uri = new URI(window.path + 'limit=10&' + toQueryString(optionzzz));

    fetch(uri)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject('Oh No! Something went wrong!')
        }
      })
      .then(data => {
        console.log(uri)
        console.log('Have some data: ', data);
      })
      .catch(error => console.log('Peep this error: ', error));


};


export default retrieve;
