// @ts-ignore

import React from 'react';
// import { scaleQuantize } from '@visx/scale';
import { Mercator, Graticule } from '@visx/geo';
import * as topojson from 'topojson-client';
import topology from '../global/world-topo.json';

export const background = '#f9f7e8';

export type GeoMercatorProps = {
	width: number;
	height: number;
	events?: boolean;
	chartData: [string, number][];
	// chartData: { [currencyCode: string]: number };
};

interface FeatureShape {
	type: 'Feature';
	id: string;
	geometry: { coordinates: [number, number][][]; type: 'Polygon' };
	properties: { name: string };
}

// @ts-expect-error
const world = topojson.feature(topology, topology.objects.units) as {
	type: 'FeatureCollection';
	features: FeatureShape[];
};

const currencyMap: { [country: string]: string } = {
	"Korea": "KRW",
	"United Arab Emirates": "AED",
	"Afghanistan": "AFN",
	"Albania": "ALL",
	"Armenia": "AMD",
	"Angola": "ANG",
	// "Angola": "AOA",
	"Argentina": "ARS",
	"Australia": "AUD",
	"Aruba": "AWG",
	"Azerbaijan": "AZN",
	"Bosnia and Herz.": "BAM",
	"Barbados": "BBD",
	"Bangladesh": "BDT",
	"Bulgaria": "BGN",
	"Bahrain": "BHD",
	"Burundi": "BIF",
	"Bermuda": "BMD",
	"Brunei": "BND",
	"Bolivia": "BOB",
	"Brazil": "BRL",
	"Bahamas": "BSD",
	"Bhutan": "BTN",
	"Botswana": "BWP",
	"Belarus": "BYN",
	"Belize": "BZD",
	"Canada": "CAD",
	"Dem. Rep. Congo": "CDF",
	"Switzerland": "CHF",
	"Chile": "CLP",
	"China": "CNY",
	"Colombia": "COP",
	"Costa Rica": "CRC",
	"Cuba": "CUP",
	"Cape Verde": "CVE",
	"Czech Rep.": "CZK",
	"Djibouti": "DJF",
	"Denmark": "DKK",
	"Dominican Rep.": "DOP",
	"Algeria": "DZD",
	"Egypt": "EGP",
	"Eritrea": "ERN",
	"Ethiopia": "ETB",
	"Eurozone": "EUR",
	"Fiji": "FJD",
	"Falkland Is.": "FKP",
	"Faeroe Is.": "FOK",
	"United Kingdom": "GBP",
	"Georgia": "GEL",
	"Guernsey": "GGP",
	"Ghana": "GHS",
	"Gibraltar": "GIP",
	"Gambia": "GMD",
	"Guinea": "GNF",
	"Guatemala": "GTQ",
	"Guyana": "GYD",
	"Hong Kong": "HKD",
	"Honduras": "HNL",
	"Croatia": "HRK",
	"Haiti": "HTG",
	"Hungary": "HUF",
	"Indonesia": "IDR",
	"Israel": "ILS",
	"Isle of Man": "IMP",
	"India": "INR",
	"Iraq": "IQD",
	"Iran": "IRR",
	"Iceland": "ISK",
	"Jersey": "JEP",
	"Jamaica": "JMD",
	"Jordan": "JOD",
	"Japan": "JPY",
	"Kenya": "KES",
	"Kyrgyzstan": "KGS",
	"Cambodia": "KHR",
	"Kiribati": "KID",
	"Comoros": "KMF",
	"Kuwait": "KWD",
	"Cayman Islands": "KYD",
	"Kazakhstan": "KZT",
	"Laos": "LAK",
	"Lebanon": "LBP",
	"Sri Lanka": "LKR",
	"Liberia": "LRD",
	"Lesotho": "LSL",
	"Libya": "LYD",
	"Morocco": "MAD",
	"Moldova": "MDL",
	"Madagascar": "MGA",
	"Macedonia": "MKD",
	"Myanmar": "MMK",
	"Mongolia": "MNT",
	"Macau": "MOP",
	"Mauritania": "MRU",
	"Mauritius": "MUR",
	"Maldives": "MVR",
	"Malawi": "MWK",
	"Mexico": "MXN",
	"Malaysia": "MYR",
	"Mozambique": "MZN",
	"Namibia": "NAD",
	"Nigeria": "NGN",
	"Nicaragua": "NIO",
	"Norway": "NOK",
	"Nepal": "NPR",
	"New Zealand": "NZD",
	"Oman": "OMR",
	"Panama": "PAB",
	"Peru": "PEN",
	"Papua New Guinea": "PGK",
	"Philippines": "PHP",
	"Pakistan": "PKR",
	"Poland": "PLN",
	"Paraguay": "PYG",
	"Qatar": "QAR",
	"Romania": "RON",
	"Serbia": "RSD",
	"Russia": "RUB",
	"Rwanda": "RWF",
	"Saudi Arabia": "SAR",
	"Solomon Is.": "SBD",
	"Seychelles": "SCR",
	"Sudan": "SDG",
	"Sweden": "SEK",
	"Singapore": "SGD",
	"Saint Helena": "SHP",
	"Sierra Leone": "SLE",
	// "Sierra Leone": "SLL",
	"Somalia": "SOS",
	"Suriname": "SRD",
	"South Sudan": "SSP",
	"São Tomé and Principe": "STN",
	"Syria": "SYP",
	"Eswatini": "SZL",
	"Thailand": "THB",
	"Tajikistan": "TJS",
	"Turkmenistan": "TMT",
	"Tunisia": "TND",
	"Tonga": "TOP",
	"Turkey": "TRY",
	"Trinidad and Tobago": "TTD",
	"Tuvalu": "TVD",
	"Taiwan": "TWD",
	"Tanzania": "TZS",
	"Ukraine": "UAH",
	"Uganda": "UGX",
	"United States": "USD",
	"Uruguay": "UYU",
	"Uzbekistan": "UZS",
	"Venezuela": "VES",
	"Vietnam": "VND",
	"Vanuatu": "VUV",
	"Samoa": "WST",
	"Central African CFA": "XAF",
	"East Caribbean": "XCD",
	"Special Drawing Rights": "XDR",
	"West African CFA": "XOF",
	"Pacific Franc": "XPF",
	"Yemen": "YER",
	"South Africa": "ZAR",
	"Zambia": "ZMW",
	"Zimbabwe": "ZWL"
};


// 변동률에 따른 색상 매핑 함수
const getColorForRateChange = (rateChange: number) => {
	if (rateChange < -1) return '#ff0000'; // -1.0 이하 빨간색
	if (rateChange < -0.5) return '#ff4f4f'; // -1.0 ~ -0.5 구간
	if (rateChange < 0) return '#ff7f7f'; // -0.5 ~ 0 구간
	if (rateChange < 0.5) return '#7ed9ee'; // 0 ~ 0.5 구간
	if (rateChange < 1) return '#00b2ff'; // 0.5 ~ 1.0 구간
	if (rateChange > 1) return '#0059ff';
	return '#808080';
};


// const color = scaleQuantize({
// 	domain: [
// 		Math.min(...world.features.map((f) => f.geometry.coordinates.length)),
// 		Math.max(...world.features.map((f) => f.geometry.coordinates.length)),
// 	],
// 	range: ['#ffb01d', '#ffa020', '#ff9221', '#ff8424', '#ff7425', '#fc5e2f', '#f94b3a', '#f63a48'],
// });

const testest = [
	{ currencyCode: 'USD', rateChange: 1.5 },
	{ currencyCode: 'KRW', rateChange: -0.2 },
	{ currencyCode: 'EUR', rateChange: 0.8 },
	// 다른 데이터들...
];

// chartData 배열을 객체로 변환하는 함수
// function transformChartDataToObject(chartData: [string, number][]) {
// 	const chartDataObject: { [currencyCode: string]: number } = {};
//
// 	// 배열을 순회하면서 객체로 변환
// 	chartData.forEach(([currencyCode, rateChange]) => {
// 		if (currencyCode !== "통화") { // 헤더를 제외하고
// 			chartDataObject[currencyCode] = rateChange;
// 		}
// 	});
//
// 	return chartDataObject;
// }
//
// function transformChartDataToArray(chartData: [string, number][]) {
// 	// 첫 번째 항목은 헤더이므로 제외하고, 나머지 데이터만 배열로 반환
// 	return chartData.slice(1).map(([currencyCode, rateChange]) => [currencyCode, rateChange]);
// }

function transformChartDataToObject(chartData: [string, number][]): { [country: string]: number } {
	// 배열을 객체로 변환
	return chartData.reduce((acc, [currencyCode, rateChange]) => {
		acc[currencyCode] = rateChange;
		return acc;
	}, {} as { [country: string]: number });
}

export default function ({ width, height, events = false, chartData }: GeoMercatorProps) {
	const centerX = width / 2;
	const centerY = height / 2;
	const scale = (width / 630) * 100;

	console.log("hi");
	console.log(chartData);

	const chartDataObject = transformChartDataToObject(chartData);

	console.log("ChartDataObject", chartData);

	return width < 10 ? null : (
		<svg width={width} height={height}>
			<rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
			<Mercator<FeatureShape>
				data={world.features}
				scale={scale}
				translate={[centerX, centerY + 50]}
				>
				{(mercator) => (
					<g>
						<Graticule graticule={(g) => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)"/>
						{mercator.features.map(({feature, path}, i) => {
							const countryName = feature.properties.name;  // 나라 이름
							const currencyCode = currencyMap[countryName];  // 나라에 해당하는 통화 코드 가져오기
							const currencyValue = chartDataObject[currencyCode];
							console.log(`Feature: ${countryName}, Currency Code: ${currencyCode}, Value: ${currencyValue}`);

							return (
								<path
									key={`map-feature-${i}`}
									d={path || ''}
									fill={getColorForRateChange(currencyValue)}
									stroke={background}
									strokeWidth={0.5}
									onClick={() => {
										if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
									}}
								/>
							);
						})}
			</g>
			)}
		</Mercator>
</svg>
)
	;
}