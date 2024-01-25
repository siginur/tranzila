# tranzila
tranzila is a Node.js library that simplifies using API of [tranzila.com](https://www.tranzila.com) service.

> The full API documentation of the service you can find [here](https://docs.tranzila.com).

## Installation

You can install this package using npm:

```bash
npm install tranzila
```

## Usage

To use tranzila, you need to require and create an instance of the class with your tranzila API credentials. Then, you can call its methods.

```javascript
const Tranzila = require('tranzila');

const tranzila = new Tranzila("<<PUBLIC_KEY>>", "<<PRIVATE_KEY>>");

// Retrieve a list of transactions
tranzila.makeRequest('POST', 'https://api.tranzila.com/v1/transactions', {
	terminal_name: "<<TERMINAL_NAME>>"
})
    .then(response => console.log(response)
    .catch(error => console.error(`Error: ${error.message}`));
```

Or you can use the static `Tranzila.getTransactionResponseCodeMessage` method to get a response code description.
```javascript
const Tranzila = require('tranzila');

console.log(Tranzila.getTransactionResponseCodeMessage("000"));
```

### Methods
`makeRequest(method, url, data)`

Sends an API request to the specified url by adding all required headers.

- method (String): `POST`, `GET`, `PUT`, `DELETE`, etc.
- url (String): The endpoint url.
- data (Object): The data to send in the request body.

Returns a Promise that resolves with the server `JSON` response or rejects with an error.

`getTransactionResponseCodeMessage(responseCode, language)`

- responseCode (String): The transaction's `processor_response_code`.
- language (String, optional): The description language. May be `en` or `he`. Defaults to `en`.

Returns a String in the specified language.

## License

This project is licensed under the MIT License - see the LICENSE file for details.