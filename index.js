const crypto = require('crypto');
const https = require("https");

class Tranzila {

	#publicKey;
	#privateKey;

	constructor(publicKey, privateKey) {
		this.#publicKey = publicKey;
		this.#privateKey = privateKey;
	}

	async makeRequest(method, url, data) {
		return new Promise((resolve, reject) => {
			try {
				let headers = this.#generateHeaders();
				const dataToSend = data ? JSON.stringify(data) : undefined;
				if (dataToSend)
					headers['Content-Length'] = dataToSend.length;

				let request = https.request(url, {
					method,
					headers
				}, (res) => {
					let responseBuffs = [];
					let responseStr = '';

					res.on('data', (chunk) => {
						if (Buffer.isBuffer(chunk))
							responseBuffs.push(chunk);
						else
							responseStr = responseStr + chunk;
					}).on('end', () => {
						try {
							responseStr = responseBuffs.length > 0 ?
								Buffer.concat(responseBuffs).toString('utf8') : responseStr;
							const json = JSON.parse(responseStr);
							resolve(json);
						} catch (e) {
							console.error("Unable to pase response", responseStr, e);
							reject(e);
						}
					});
				})

				request.on('error', (err) => {
					reject(err);
				});
				if (dataToSend)
					request.write(dataToSend);
				request.end();
			} catch (e) {
				reject(e);
			}
		});
	}

	#generateHeaders() {
		const time = Math.round((new Date()).getTime() / 1000);
		const nonce = crypto.randomBytes(40).toString('hex');
		const hash = crypto
			.createHmac('sha256', this.#privateKey + time + nonce)
			.update(this.#publicKey)
			.digest('hex');

		return {
			'Content-Type': 'application/json',
			'User-Agent': 'RoyNave-server',
			'X-tranzila-api-app-key': this.#publicKey,
			'X-tranzila-api-request-time': time,
			'X-tranzila-api-nonce': nonce,
			'X-tranzila-api-access-token': hash
		}
	}

	static getTransactionResponseCodeMessage(code, language = 'en') {
		const db = require('./resources/transactionResponseCodeMessages.json');
		const map = db[code ?? ""] ?? {};
		return map[(language ?? 'en').toLowerCase()] ?? map['en'] ?? map['he'] ?? undefined;
	}
}

module.exports = Tranzila;