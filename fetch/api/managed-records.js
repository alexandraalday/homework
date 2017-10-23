import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records?"; 

// Your retrieve function plus any additional functions go here ...
const retrieve = (options) => { 

	let uri = new URI(window.path + 'limit=10&' + queryString);
    let optionzzz = options
    let queryString = [];

    Object.toQueryString = (optionzzz, base) => {

        Object.keys(optionzzz).forEach((key) => {

            let result,
                value;

            value =  optionzzz[key];

            if (base) {
                key = base + '[]';
            }
            switch (typeof value) {
                case 'object': 
                    result = Object.toQueryString(value, key); 
                    break;
                case 'array':
                    let qs = {};
                    value.forEach((val, i) => {
                        qs[i] = val;
                    });
                    result = Object.toQueryString(qs, key);
                    break;
                default: 
                    result = 'offset=' + (value - 1);
            }

            if (value != null) {
                queryString.push(result);
            }
        });
        return queryString.join('&');
    };


    fetch(uri)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject('Oh No! Something went wrong!')
        }
      })
      .then(data => console.log('Have some data: ', data))
      .catch(error => console.log('Peep this error: ', error));


};


export default retrieve;
