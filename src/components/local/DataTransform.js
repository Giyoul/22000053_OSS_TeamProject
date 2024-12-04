import axios from "axios";

const transferData = async () => {
	try {
		const response = await axios.get(
			"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
		);

		if (response.data.length > 0) {
			const dataToTransfer = response.data[0]; // 첫 번째 데이터를 선택
			await axios.post(
				"https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata",
				dataToTransfer
			);
			console.log("데이터가 성공적으로 옮겨졌습니다!");
		} else {
			console.log("currentdata에 데이터가 없습니다.");
		}
	} catch (err) {
		console.error("데이터 옮기기 실패:", err);
	}
};


// 이 파일을 import한 곳에서 실행하려면
export const executeDataTransfer = () => {
	transferData();
};