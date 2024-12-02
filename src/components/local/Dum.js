import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DataManage.css";

function DataManage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

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
		fetchDataAndPost();
	}, []);

	return (
		<div className="data-manage">
			<h1>Data Management</h1>
			{loading && <p>데이터를 처리 중입니다...</p>}
			{error && <p className="error">{error}</p>}
			{!loading && !error && <p>데이터 처리가 완료되었습니다.</p>}
		</div>
	);
}

export default DataManage;
