import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import {checkAndUpdateData} from "./CheckAndUpdateData";
import "./MainPage.css";

function MainPage() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchExchangeRateData = async () => {
		setLoading(true);
		setError(null);

		try {
			// 어제와 오늘 데이터를 각각 가져옴
			const yesterdayResponse = await axios.get(
				"https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata"
			);
			const todayResponse = await axios.get(
				"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
			);

			if (yesterdayResponse.data.length === 0 || todayResponse.data.length === 0) {
				setError("어제 또는 오늘 데이터가 없습니다.");
				setLoading(false);
				return;
			}

			const yesterdayRates = yesterdayResponse.data[0].conversion_rates;
			const todayRates = todayResponse.data[0].conversion_rates;

			// 환율 상승률 계산
			const rateChanges = Object.keys(todayRates).map((currency) => {
				const yesterdayRate = yesterdayRates[currency] || 0;
				const todayRate = todayRates[currency] || 0;

				const changePercentage = yesterdayRate
					? ((todayRate - yesterdayRate) / yesterdayRate) * 100
					: 0;

				return {
					currency,
					changePercentage,
				};
			});

			// 상승률 기준으로 정렬
			const sortedRates = rateChanges.sort(
				(a, b) => b.changePercentage - a.changePercentage
			);

			setData(sortedRates);
		} catch (err) {
			console.error("Error fetching exchange rate data:", err);
			setError("데이터를 가져오는 중 문제가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const initializeData = async () => {
			try {
				await checkAndUpdateData(); // 데이터 상태 확인 및 필요시 업데이트
				await fetchExchangeRateData(); // 데이터를 가져오기
			} catch (err) {
				setError(err.message);
			}
		};

		initializeData();
	}, []);


	const chartData = [
		["통화", "상승률 (%)"],
		...data.map(({ currency, changePercentage }) => [currency, changePercentage]),
	];

	const chartOptions = {
		title: "환율 상승률",
		hAxis: {
			title: "통화",
		},
		vAxis: {
			title: "상승률 (%)",
		},
		legend: { position: "none" },
	};

	return (
		<div className="main-page">
			<h1>환율 상승률 순위</h1>
			{loading && <p>데이터를 가져오는 중입니다...</p>}
			{error && <p className="error">{error}</p>}

			{!loading && !error && (
				<>
					<table className="rate-table">
						<thead>
						<tr>
							<th>통화</th>
							<th>상승률 (%)</th>
						</tr>
						</thead>
						<tbody>
						{data.map(({ currency, changePercentage }) => (
							<tr key={currency}>
								<td>{currency}</td>
								<td>{changePercentage.toFixed(2)}</td>
							</tr>
						))}
						</tbody>
					</table>

					<Chart
						chartType="BarChart"
						data={chartData}
						options={chartOptions}
						width="100%"
						height="400px"
					/>
				</>
			)}
		</div>
	);
}

export default MainPage;