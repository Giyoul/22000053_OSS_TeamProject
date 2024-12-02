import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DataManage.css";
import { executeDataTransfer } from "./DataTransform";

function DataManage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null); // 데이터를 저장할 상태 추가

	// 데이터를 Fetch 후 Post
	const fetchDataAndPost = async () => {
		if (loading) return; // 이미 로딩 중이면 함수 종료 (중복 호출 방지)

		setLoading(true);
		setError(null);

		try {
			// 환율 데이터 가져오기
			const response = await axios.get(
				"https://v6.exchangerate-api.com/v6/cf7cbf44f36d2101e3e760ab/latest/KRW"
			);

			// 데이터를 Mock API 구조에 맞게 변환
			const fetchedData = response.data;
			const transformedData = {
				documentation: fetchedData.documentation,
				terms_of_use: fetchedData.terms_of_use,
				time_last_update_unix: fetchedData.time_last_update_unix,
				time_last_update_utc: fetchedData.time_last_update_utc,
				time_next_update_unix: fetchedData.time_next_update_unix,
				time_next_update_utc: fetchedData.time_next_update_utc,
				base_code: fetchedData.base_code,
				conversion_rates: fetchedData.conversion_rates,
			};

			// 데이터를 Mock API에 저장
			await axios.post(
				"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata",
				transformedData
			);

			// 저장된 데이터를 상태에 저장
			setData(transformedData);

			alert("데이터가 성공적으로 저장되었습니다!");
		} catch (err) {
			console.error("Error while fetching or posting data:", err);
			setError("데이터 처리 중 문제가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	// 컴포넌트가 마운트될 때 데이터 처리
	useEffect(() => {
		const fetchData = async () => {
			await fetchDataAndPost(); // 데이터 fetch 후 post
			executeDataTransfer(); // 데이터 전송
		};

		fetchData();
	}, []); // 빈 배열을 사용하여 컴포넌트 마운트 시 한 번만 실행

	return (
		<div className="data-manage">
			<h1>Data Management</h1>
			{loading && <p>데이터를 처리 중입니다...</p>}
			{error && <p className="error">{error}</p>}
			{!loading && !error && <p>데이터 처리가 완료되었습니다.</p>}

			{/* 데이터를 대충 출력 */}
			{data && (
				<div>
					<h3>Base Code: {data.base_code}</h3>
					<p>Documentation: {data.documentation}</p>
					<p>Terms of Use: {data.terms_of_use}</p>
					<p>Last Update (UTC): {data.time_last_update_utc}</p>
					<p>Next Update (UTC): {data.time_next_update_utc}</p>

					<h4>Conversion Rates:</h4>
					<ul>
						{Object.entries(data.conversion_rates).map(([currency, rate]) => (
							<li key={currency}>
								{currency}: {rate}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default DataManage;
