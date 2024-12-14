import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import WorldMapChart from "../local/WorldMapChart";
import "./MainPage.css";

function MainPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);



    const currencyNames = {
        AED: "아랍에미리트 디르함",
        AFN: "아프가니스탄 아프가니",
        ALL: "알바니아 레크",
        AMD: "아르메니아 드람",
        ANG: "네덜란드령 안틸레스 길더",
        AOA: "앙골라 콴자",
        ARS: "아르헨티나 페소",
        AUD: "호주 달러",
        AWG: "아루바 플로린",
        AZN: "아제르바이잔 마나트",
        BAM: "보스니아-헤르체고비나 태환 마르크",
        BBD: "바베이도스 달러",
        BDT: "방글라데시 타카",
        BGN: "불가리아 레프",
        BHD: "바레인 디나르",
        BIF: "부룬디 프랑",
        BMD: "버뮤다 달러",
        BND: "브루나이 달러",
        BOB: "볼리비아 볼리비아노",
        BRL: "브라질 레알",
        BSD: "바하마 달러",
        BTN: "부탄 눌트럼",
        BWP: "보츠와나 풀라",
        BYN: "벨라루스 루블",
        BZD: "벨리즈 달러",
        CAD: "캐나다 달러",
        CDF: "콩고 프랑",
        CHF: "스위스 프랑",
        CLP: "칠레 페소",
        CNY: "중국 위안",
        COP: "콜롬비아 페소",
        CRC: "코스타리카 콜론",
        CUP: "쿠바 페소",
        CVE: "카보베르데 에스쿠도",
        CZK: "체코 코루나",
        DJF: "지부티 프랑",
        DKK: "덴마크 크로네",
        DOP: "도미니카 페소",
        DZD: "알제리 디나르",
        EGP: "이집트 파운드",
        ERN: "에리트레아 나크파",
        ETB: "에티오피아 비르",
        EUR: "유로",
        FJD: "피지 달러",
        FKP: "포클랜드 제도 파운드",
        FOK: "페로 제도 크로나",
        GBP: "영국 파운드 스털링",
        GEL: "조지아 라리",
        GGP: "건지 파운드",
        GHS: "가나 세디",
        GIP: "지브롤터 파운드",
        GMD: "감비아 달라시",
        GNF: "기니 프랑",
        GTQ: "과테말라 케찰",
        GYD: "가이아나 달러",
        HKD: "홍콩 달러",
        HNL: "온두라스 렘피라",
        HRK: "크로아티아 쿠나",
        HTG: "아이티 구르드",
        HUF: "헝가리 포린트",
        IDR: "인도네시아 루피아",
        ILS: "이스라엘 신 셰켈",
        IMP: "맨섬 파운드",
        INR: "인도 루피",
        IQD: "이라크 디나르",
        IRR: "이란 리얄",
        ISK: "아이슬란드 크로나",
        JEP: "저지 파운드",
        JMD: "자메이카 달러",
        JOD: "요르단 디나르",
        JPY: "일본 엔",
        KES: "케냐 실링",
        KGS: "키르기스스탄 솜",
        KHR: "캄보디아 리엘",
        KID: "키리바시 달러",
        KMF: "코모로 프랑",
        KWD: "쿠웨이트 디나르",
        KYD: "케이맨 제도 달러",
        KZT: "카자흐스탄 텡게",
        LAK: "라오스 킵",
        LBP: "레바논 파운드",
        LKR: "스리랑카 루피",
        LRD: "라이베리아 달러",
        LSL: "레소토 로티",
        LYD: "리비아 디나르",
        MAD: "모로코 디르함",
        MDL: "몰도바 레우",
        MGA: "마다가스카르 아리아리",
        MKD: "북마케도니아 데나르",
        MMK: "미얀마 차트",
        MNT: "몽골 투그릭",
        MOP: "마카오 파타카",
        MRU: "모리타니 우기야",
        MUR: "모리셔스 루피",
        MVR: "몰디브 루피야",
        MWK: "말라위 콰차",
        MXN: "멕시코 페소",
        MYR: "말레이시아 링깃",
        MZN: "모잠비크 메티칼",
        NAD: "나미비아 달러",
        NGN: "나이지리아 나이라",
        NIO: "니카라과 코르도바",
        NOK: "노르웨이 크로네",
        NPR: "네팔 루피",
        NZD: "뉴질랜드 달러",
        OMR: "오만 리얄",
        PAB: "파나마 발보아",
        PEN: "페루 솔",
        PGK: "파푸아뉴기니 키나",
        PHP: "필리핀 페소",
        PKR: "파키스탄 루피",
        PLN: "폴란드 즐로티",
        PYG: "파라과이 과라니",
        QAR: "카타르 리얄",
        RON: "루마니아 레우",
        RSD: "세르비아 디나르",
        RUB: "러시아 루블",
        RWF: "르완다 프랑",
        SAR: "사우디아라비아 리얄",
        SBD: "솔로몬 제도 달러",
        SCR: "세이셸 루피",
        SDG: "수단 파운드",
        SEK: "스웨덴 크로나",
        SGD: "싱가포르 달러",
        SHP: "세인트헬레나 파운드",
        SLE: "시에라리온 리온",
        SLL: "시에라리온 리온",
        SOS: "소말리아 실링",
        SRD: "수리남 달러",
        SSP: "남수단 파운드",
        STN: "상투메 프린시페 도브라",
        SYP: "시리아 파운드",
        SZL: "에스와티니 릴랑게니",
        THB: "태국 바트",
        TJS: "타지키스탄 소모니",
        TMT: "투르크메니스탄 마나트",
        TND: "튀니지 디나르",
        TOP: "통가 팡가",
        TRY: "터키 리라",
        TTD: "트리니다드토바고 달러",
        TVD: "투발루 달러",
        TWD: "대만 달러",
        TZS: "탄자니아 실링",
        UAH: "우크라이나 흐리브냐",
        UGX: "우간다 실링",
        USD: "미국 달러",
        UYU: "우루과이 페소",
        UZS: "우즈베키스탄 숨",
        VES: "베네수엘라 볼리바르",
        VND: "베트남 동",
        VUV: "바누아투 바투",
        WST: "사모아 탈라",
        XAF: "중앙아프리카 CFA 프랑",
        XCD: "동카리브 달러",
        XDR: "특별인출권",
        XOF: "서아프리카 CFA 프랑",
        XPF: "태평양 프랑",
        YER: "예멘 리알",
        ZAR: "남아프리카 랜드",
        ZMW: "잠비아 콰차",
        ZWL: "짐바브웨 달러",
        KRW: "대한민국 원화"
    };


    const fetchExchangeRateData = async () => {
        try {
            setLoading(true);
            const todayResponse = await axios.get(
                "https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
            );
            const yesterdayResponse = await axios.get(
                "https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata"
            );

            if (todayResponse.data.length === 0 || yesterdayResponse.data.length === 0) {
                throw new Error("어제 또는 오늘 데이터가 없습니다.");
            }

            const todayRates = todayResponse.data[0].conversion_rates;
            const yesterdayRates = yesterdayResponse.data[0].conversion_rates;

            const rateChanges = Object.keys(todayRates).map((currency) => {
                const todayRate = todayRates[currency] || 0;
                const yesterdayRate = yesterdayRates[currency] || 0;
                const changePercentage =
                    yesterdayRate > 0
                        ? ((todayRate - yesterdayRate) / yesterdayRate) * 100
                        : 0;

                return {
                    currency,
                    koreanName: currencyNames[currency] || "이름 없음",
                    changePercentage: parseFloat(changePercentage.toFixed(2)),
                    todayRate: todayRate.toFixed(4),
                    yesterdayRate: yesterdayRate.toFixed(4),
                };
            });

            setData(rateChanges);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching exchange rate data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExchangeRateData();


    }, []);

    const sortData = (type) => {
        const sortedData = [...data].sort((a, b) => {
            if (type === "ABC") return a.currency.localeCompare(b.currency);
            if (type === "상승률") return b.changePercentage - a.changePercentage;
            if (type === "하락률") return a.changePercentage - b.changePercentage;
            return 0;
        });
        setData(sortedData);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredData = data.filter(({ currency, koreanName }) =>
        currency.toLowerCase().includes(searchQuery) ||
        koreanName.toLowerCase().includes(searchQuery)
    );

    const showDetails = (currency, yesterdayRate, todayRate) => {
        const countryName = currencyNames[currency] || "국가 이름을 찾을 수 없음";
        setDetails({ currency, countryName, yesterdayRate, todayRate });
        setIsModalOpen(true);
    };

    return (
        <div className={`main-page ${isModalOpen ? "blur-background" : ""}`}>
            <header className="header">
                <h1 className={"country-name"}>국가 별 전날 대비 환율 상승률</h1>
                <p className="api-reference">
                    Reference: <a href="https://www.exchangerate-api.com/" target="_blank"
                                  rel="noopener noreferrer">ExchangeRate-API</a>
                </p>
            </header>

            <div className="container">
            <section className="creator-info">
                <h2 className="maker-name">제작자 정보</h2>
                <p className="maker-name">
                    <span className="creator-name">조성준</span> (<span
                    className="creator-id">21800690</span>) &nbsp;|&nbsp;
                    <span className="creator-name">김기영</span> (<span className="creator-id">22000053</span>)
                </p>
            </section>

            {loading && <p>데이터를 가져오는 중입니다...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="container-all">
                    <div className="left-container">
                        <div className="controls-container">
                            <div className="button-group">
                                <button className="sort-button" onClick={() => sortData("ABC")}>
                                    ABC 순 정렬
                                </button>
                                <button className="sort-button" onClick={() => sortData("상승률")}>
                                    상승률 순 정렬
                                </button>
                                <button className="sort-button" onClick={() => sortData("하락률")}>
                                    하락률 순 정렬
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="통화 이름 또는 코드 검색"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <table className="rate-table">
                            <thead>
                            <tr>
                                <th>순번</th>
                                <th>통화</th>
                                <th>한국어 이름</th>
                                <th>상승률 (%)</th>
                                <th>수치 데이터</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.currency}>
                                    <td>{index + 1}</td>
                                    <td>{item.currency}</td>
                                    <td>{item.koreanName}</td>
                                    <td>{item.changePercentage}</td>
                                    <td>
                                        <button className="detail-button"
                                            onClick={() =>
                                                showDetails(
                                                    item.currency,
                                                    item.yesterdayRate,
                                                    item.todayRate
                                                )
                                            }
                                        >
                                            수치 데이터
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="right-container">
                        <button
                            className="chart-toggle-button"
                            onClick={() => setShowChart(!showChart)}
                        >
                            {showChart ? "지도 보기" : "차트 보기"}
                        </button>
                        {showChart ? (
                            <Chart
                                chartType="BarChart"
                                data={[
                                    ["통화", "상승률 (%)"],
                                    ...data.map(({currency, changePercentage}) => [
                                        currency,
                                        changePercentage,
                                    ]),
                                ]}
                                width="100%"
                                height="400px"
                            />
                        ) : (
                            <WorldMapChart
                                chartData={[
                                    ["통화", "상승률 (%)"],
                                    ...data.map(({currency, changePercentage}) => [
                                        currency,
                                        changePercentage,
                                    ]),
                                ]}
                                width={800}
                                height={600}
                            />
                        )}
                    </div>
                </div>
            )}
            {isModalOpen && (
                <>
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)} />
                    <div className="modal">
                        <div className="modal-content">
                            <h3>{details.countryName} ({details.currency})</h3>
                            <p>어제 환율: {details.yesterdayRate}</p>
                            <p>오늘 환율: {details.todayRate}</p>
                            <button onClick={() => setIsModalOpen(false)}>닫기</button>
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>
    );
}

export default MainPage;
