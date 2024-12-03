import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../local/MainPage";
import DataManage from "../local/DataManage";

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage />} /> {/* MainPage를 기본 경로에 연결 */}
				<Route path="/datamanage" element={<DataManage />} />
			</Routes>
		</BrowserRouter>
	);
}
