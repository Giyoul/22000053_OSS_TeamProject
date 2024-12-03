import axios from "axios";
import { executeDataTransfer } from "./DataTransform";

export const checkAndUpdateData = async () => {
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

			// 새로운 데이터를 가져오기
			const fetchResponse = await axios.get(
				"https://v6.exchangerate-api.com/v6/cf7cbf44f36d2101e3e760ab/latest/KRW"
			);
			const fetchedData = fetchResponse.data;

// 데이터를 MockAPI 구조에 맞게 변환
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

// currentdata에 새로운 데이터를 POST
			await axios.post(
				"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata",
				transformedData
			);

			// 데이터 새로 가져오기
			console.log("데이터를 새로 가져오고 있습니다.");
		} else {
			// 날짜가 오늘이면 아무 작업도 하지 않음
			console.log("오늘의 데이터는 이미 업데이트되었습니다.");
		}
	} catch (err) {
		console.error("Error fetching currentdata:", err);
		throw new Error("현재 데이터 확인 중 문제가 발생했습니다.");
	}
};
