import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainPage.css";

function List() {
	const [burgers, setBurgers] = useState([]);
	const navigate = useNavigate();

	// 데이터 가져오기
	useEffect(() => {
		axios
			.get("https://6747ce2938c8741641d7b978.mockapi.io/api/data")
			.then((response) => setBurgers(response.data))
			.catch((error) => console.error("Error fetching data:", error));
	}, []);

	// 삭제 핸들러
	const handleDelete = (id) => {
		if (window.confirm("정말로 삭제하시겠습니까?")) {
			axios
				.delete(`https://6747ce2938c8741641d7b978.mockapi.io/api/data/${id}`)
				.then(() => {
					setBurgers((prevBurgers) => prevBurgers.filter((burger) => burger.id !== id));
					alert("삭제되었습니다.");
				})
				.catch((error) => {
					console.error("Error deleting data:", error);
					alert("삭제에 실패했습니다.");
				});
		}
	};

	return (
		<div className="container list-container">
			<h1>버거킹 메뉴 정보</h1>
			<div className="button-group">
				<button className="add-button" onClick={() => navigate("/add")}>
					Add New Burger
				</button>
				<button
					className="edit-button"
					onClick={() => navigate("/update", { state: { burgers } })}
				>
					Edit All
				</button>
			</div>
			<ul>
				{burgers.map((burger) => (
					<li key={burger.id}>
						<span>
							{burger.name} - {burger.price}원
						</span>
						<div>
							<button
								className="secondary"
								onClick={() => navigate("/detail", { state: { burger } })}
							>
								View Details
							</button>
							<button
								className="delete-button"
								onClick={() => handleDelete(burger.id)}
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default List;
