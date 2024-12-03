import React, { useEffect, useState } from "react";
import axios from "axios";
import { executeDataTransfer } from "./DataTransform";
import "./DataManage.css";

function DataManage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null); // 데이터를 저장할 상태 추가

	// 데이터를 Fetch 후 Post
	const fetchDataAndPost = async () => {
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

	// currentdata의 날짜를 확인하고 필요시 데이터 처리
	const checkAndUpdateData = async () => {
		try {
			// currentdata에서 최신 데이터를 가져옴
			const response = await axios.get(
				"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
			);

			// 가장 최신 데이터의 time_last_update_utc를 가져옴
			const latestData = response.data[0];
			const lastUpdateDate = new Date(latestData.time_last_update_utc);

			// 현재 날짜와 비교하여 다르면 DataTransform을 먼저 실행
			const today = new Date();
			if (
				lastUpdateDate.getUTCDate() !== today.getUTCDate() ||
				lastUpdateDate.getUTCMonth() !== today.getUTCMonth() ||
				lastUpdateDate.getUTCFullYear() !== today.getUTCFullYear()
			) {
				// 날짜가 다르면 먼저 lastdata 삭제
				const lastDataResponse = await axios.get(
					"https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata"
				);

				// lastdata에서 id를 가져와서 삭제
				if (lastDataResponse.data.length > 0) {
					const lastDataId = lastDataResponse.data[0].id; // 첫 번째 lastdata의 id를 사용
					await axios.delete(
						`https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata/${lastDataId}`
					);
				}

				// executeDataTransfer 실행
				executeDataTransfer();

				// currentdata에서 데이터를 삭제하기 전에 데이터를 조회하고 id 값을 사용하여 삭제
				const dataResponse = await axios.get(
					"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
				);

				// currentdata에서 id를 가져와서 삭제
				if (dataResponse.data.length > 0) {
					const id = dataResponse.data[0].id; // 첫 번째 currentdata의 id를 사용
					await axios.delete(
						`https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata/${id}`
					);
				}

				// 데이터 새로 가져오기
				fetchDataAndPost(); // DataManage.js의 fetchDataAndPost 실행
			} else {
				// 날짜가 오늘이면 DataManage만 실행
				setData(latestData); // 기존 데이터 그대로 표시
				alert("오늘의 데이터는 이미 업데이트되었습니다.");
			}
		} catch (err) {
			console.error("Error fetching currentdata:", err);
			setError("현재 데이터 확인 중 문제가 발생했습니다.");
		}
	};


	// 컴포넌트가 마운트될 때 데이터 처리
	useEffect(() => {
		checkAndUpdateData(); // 페이지 로드 시 데이터 상태 확인
	}, []);

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