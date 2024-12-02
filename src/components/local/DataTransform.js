import axios from "axios";

const transferData = async () => {
	try {
		// currentdata에서 데이터 가져오기
		const response = await axios.get(
			"https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
		);

		// 데이터를 lastdata로 POST로 보내기
		await axios.post(
			"https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata",
			response.data
		);

		console.log("데이터가 성공적으로 옮겨졌습니다!");
	} catch (err) {
		console.error("데이터 옮기기 실패:", err);
	}
};

// 이 파일을 import한 곳에서 실행하려면
export const executeDataTransfer = () => {
	transferData();
};
