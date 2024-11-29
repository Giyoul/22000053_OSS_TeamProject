import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "../local/MainPage";
// import Detail from './Detail';
// import Update from './Update';
// import Add from './AddBurger'
import Test from "../local/Test";

export default function Router() {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Test />} />
				{/*<Route exact path='/' element={<MainPage />} />*/}
				{/*<Route path='/list' element={<List />} />*/}
				{/*<Route path='/add' element={<Add />}/>*/}
				{/*<Route path='/detail' element={<Detail />} />*/}
				{/*<Route path='/update' element={<Update />} />*/}
			</Routes>
		</BrowserRouter>
	)
};