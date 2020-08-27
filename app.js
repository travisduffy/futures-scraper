const fetch = require('node-fetch')
const cheerio = require('cheerio')

// Root URLS
const rootURL = 'https://ca.investing.com'
const indicesURL = `${rootURL}/indices`
const commoditiesURL = `${rootURL}/commodities`

// Indices
const spxURL = `${indicesURL}/us-spx-500-futures-advanced-chart`
const nqURL = `${indicesURL}/nq-100-futures`
const vixURL = `${indicesURL}/us-spx-vix-futures`

// Commodities
const gldURL = `${commoditiesURL}/gold`
const slvURL = `${commoditiesURL}/silver`

// Builds request for fetching HTML and converting to a cheerio DOM object
const getDOM = async url => {
	return fetch(url, { mode: 'no-cors' })
		.then(res => res.text())
		.then(html => cheerio.load(html))
		.catch(error => {
			console.warn(error)
		})
}

// Pulls required data from cheerio DOM object
const extractFuturesData = DOM => {
	const name = DOM('#leftColumn .instrumentHead > h1')
		.text()
		.split('-')[0]
		.trim()

	const priceData = []
	DOM('#last_last')
		.parent()
		.children('span[dir="ltr"]')
		.each((i, elem) => {
			priceData[i] = DOM(elem).text()
		})

	return {
		name,
		price: priceData[0],
		dlrChange: priceData[1],
		percChange: priceData[2],
	}
}

const main = async () => {
	const urls = [spxURL, nqURL, vixURL, gldURL, slvURL]
	const promises = urls.map(getDOM)

	console.log('⏳ scraping...')
	const DOMs = await Promise.all(promises)
	console.log('🎉 scrape complete!')

	const futuresData = DOMs.map(extractFuturesData)
	console.log({ date: Date(), futuresData })
}

main()
