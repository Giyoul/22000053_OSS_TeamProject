import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { checkAndUpdateData } from "./CheckAndUpdateData";
import WorldMapChart from "../local/WorldMapChart";
// import GeoMercator, { GeoMercatorProps } from './WorldMapChart'; // 컴포넌트 파일 이름에 맞게 경로 수정
// import WorldMapChart from './WorldMapChart';


import "./MainPage.css";

function MainPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSortedByABC, setIsSortedByABC] = useState(true);
    const [details, setDetails] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태

    const currencyNames = {
        AED: "아랍에미리트 디르함",
        // ... 나머지 통화 이름 매핑
        ZWL: "짐바브웨 달러",
    };

    const fetchExchangeRateData = async () => {
        setLoading(true);
        setError(null);

        try {
            const yesterdayResponse = await axios.get(
                "https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata"
            );
            const todayResponse = await axios.get(
                "https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
            );

            if (!yesterdayResponse.data.length || !todayResponse.data.length) {
                setError("어제 또는 오늘 데이터가 없습니다.");
                setLoading(false);
                return;
            }

            const yesterdayRates = yesterdayResponse.data[0].conversion_rates;
            const todayRates = todayResponse.data[0].conversion_rates;

            const rateChanges = Object.keys(todayRates).map((currency) => {
                const yesterdayRate = yesterdayRates[currency] || 0;
                const todayRate = todayRates[currency] || 0;

                const changePercentage = yesterdayRate
                    ? ((todayRate - yesterdayRate) / yesterdayRate) * 100
                    : 0;

                return {
                    currency,
                    changePercentage: parseFloat(changePercentage.toFixed(2)),
                    yesterdayRate,
                    todayRate,
                };
            });

            const sortedRates = rateChanges.sort((a, b) =>
                a.currency.localeCompare(b.currency)
            );

            setData(sortedRates);
        } catch (err) {
            console.error("Error fetching exchange rate data:", err);
            setError("데이터를 가져오는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSortOrder = () => {
        if (isSortedByABC) {
            const sortedByRate = [...data].sort(
                (a, b) => b.changePercentage - a.changePercentage
            );
            setData(sortedByRate);
        } else {
            const sortedByABC = [...data].sort((a, b) =>
                a.currency.localeCompare(b.currency)
            );
            setData(sortedByABC);
        }
        setIsSortedByABC(!isSortedByABC);
    };

    const showDetails = (currency, yesterdayRate, todayRate) => {
        const countryName = currencyNames[currency] || "국가 이름을 찾을 수 없음";
        setDetails({ currency, countryName, yesterdayRate, todayRate });
    };

    const closeDetails = () => {
        setDetails(null);
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                await checkAndUpdateData();
                await fetchExchangeRateData();
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
        title: "국가 별 환율 상승률(어제대비)",
        hAxis: {
            title: "통화",
        },
        vAxis: {
            title: "상승률 (%)",
        },
        legend: { position: "none" },
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = data.filter(({ currency }) =>
        currencyNames[currency]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="main-page">
            <h1>국가 별 전날 대비 환율 상승률</h1>
            {loading && <p>데이터를 가져오는 중입니다...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="container-all">
                    <div className="controls-container">
                        <button className="sort-button" onClick={toggleSortOrder}>
                            {isSortedByABC ? "상승률 순으로 정렬" : "ABC 순으로 정렬"}
                        </button>
                        <div className="search-group">
                            <input
                                type="text"
                                placeholder="통화 이름 또는 코드 검색"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <button className="search-button">검색</button>
                        </div>
                    </div>

                    <button
                        className="chart-toggle-button"
                        onClick={() => setShowChart(!showChart)}
                    >
                        {showChart ? "차트 숨기기" : "차트 보기"}
                    </button>

                    <WorldMapChart width={1000} height={800} chartData={chartData} />

                    {showChart && (
                        <div className="chart-container">
                            <Chart
                                chartType="BarChart"
                                data={chartData}
                                options={chartOptions}
                                width="100%"
                                height="400px"
                            />
                        </div>
                    )}

                    <table className="rate-table">
                        <thead>
                        <tr>
                            <th>순번</th>
                            <th>통화</th>
                            <th>상승률 (%)</th>
                            <th>세부정보</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.map(({ currency, changePercentage, yesterdayRate, todayRate }, index) => (
                            <tr key={currency}>
                                <td>{index + 1}</td>
                                <td>{currency}</td>
                                <td>{changePercentage.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="details-button"
                                        onClick={() =>
                                            showDetails(currency, yesterdayRate, todayRate)
                                        }
                                    >
                                        세부정보
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {details && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>{details.countryName} ({details.currency})</h3>
                                <p>어제 환율: {details.yesterdayRate}</p>
                                <p>오늘 환율: {details.todayRate}</p>
                                <button className="close-button" onClick={closeDetails}>
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!loading && !error && data.length === 0 && (
                <p>표시할 데이터가 없습니다.</p>
            )}
        </div>
    );
}

export default MainPage;