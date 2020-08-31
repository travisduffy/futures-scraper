const fetch = require('node-fetch')
const cheerio = require('cheerio')

// URL builders
const rootURL = 'https://ca.investing.com'
const indexURL = endpoint => `${rootURL}/indices${endpoint}`
const commURL = endpoint => `${rootURL}/commodities${endpoint}`

// Indices
const spxURL = indexURL('/us-spx-500-futures-advanced-chart')
const nqURL = indexURL('/nq-100-futures')
const vixURL = indexURL('/us-spx-vix-futures')

// Commodities
const gldURL = commURL('/gold')
const slvURL = commURL('/silver')

// URLs to scrape
const URLs = [spxURL, nqURL, vixURL, gldURL, slvURL]

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

	const greenClockIcon = DOM(
		'div.instrumentDataDetails > div.left > div.bottom > span.greenClockBigIcon'
	)

	return {
		name,
		price: priceData[0],
		dlrChange: priceData[1],
		percChange: priceData[2],
		marketsOpen: greenClockIcon.length ? true : false,
	}
}

const main = async () => {
	console.log('⏳ scraping...')

	const promises = URLs.map(getDOM)
	const DOMs = await Promise.all(promises)
	const futuresData = DOMs.map(extractFuturesData)

	console.log('🎉 scrape complete! 🎉')
	console.log({ date: Date(), futuresData })
}

main()
