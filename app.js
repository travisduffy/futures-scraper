const fetch = require('node-fetch')
const cheerio = require('cheerio')

// root urls
const rootURL = 'https://ca.investing.com'
const indicesURL = `${rootURL}/indices`
const commoditiesURL = `${rootURL}/commodities`

// indices
const spxURL = `${indicesURL}/us-spx-500-futures-advanced-chart`
const nqURL = `${indicesURL}/nq-100-futures`
const vixURL = `${indicesURL}/us-spx-vix-futures`

// commodities
const gldURL = `${commoditiesURL}/gold`
const slvURL = `${commoditiesURL}/silver`

const getDOM = async url => {
	return fetch(url, { mode: 'no-cors' })
		.then(res => res.text())
		.then(html => cheerio.load(html))
		.catch(error => {
			console.warn(error)
		})
}

const main = async () => {
	const urls = [spxURL, nqURL, vixURL, gldURL, slvURL]
	const promises = urls.map(getDOM)

	console.log('⏳ scraping...')
	const [spxDOM, nqDOM, vixDOM, gldDOM, slvDOM] = await Promise.all(promises)
	console.log('🎉 scrape complete!')

	let spxPrice = spxDOM('#last_last').text()
	let nqPrice = nqDOM('#last_last').text()
	let vixPrice = vixDOM('#last_last').text()

	let gldPrice = gldDOM('#last_last').text()
	let slvPrice = slvDOM('#last_last').text()

	const futuresData = [
		{
			asset: 'S&P 500',
			price: spxPrice,
		},
		{
			asset: 'Nasdaq',
			price: nqPrice,
		},
		{
			asset: 'VIX',
			price: vixPrice,
		},
		{
			asset: 'Gold',
			price: gldPrice,
		},
		{
			asset: 'Silver',
			price: slvPrice,
		},
	]

	console.log({ futuresData })
}

main()
