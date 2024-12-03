import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { checkAndUpdateData } from "./CheckAndUpdateData";
import "./MainPage.css";

function MainPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSortedByABC, setIsSortedByABC] = useState(true); // 정렬 상태 추가
    const [details, setDetails] = useState(null); // 세부정보 상태 추가
    const [showChart, setShowChart] = useState(false); // 차트 표시 여부 상태

    // 통화 코드와 한국어 국가명 매핑
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
        BOB: "볼리비아노",
        BRL: "브라질 헤알",
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
        ERN: "에리트레아 낙파",
        ETB: "에티오피아 비르",
        EUR: "유로",
        FJD: "피지 달러",
        FKP: "포클랜드 제도 파운드",
        FOK: "페로 제도 크로나",
        GBP: "영국 파운드",
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
        IMP: "맨 섬 파운드",
        INR: "인도 루피",
        IQD: "이라크 디나르",
        IRR: "이란 리얄",
        ISK: "아이슬란드 크로나",
        JEP: "저지 섬 파운드",
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
        MMK: "미얀마 짯",
        MNT: "몽골 투그릭",
        MOP: "마카오 파타카",
        MRU: "모리타니 우기야",
        MUR: "모리셔스 루피",
        MVR: "몰디브 루피아",
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
        PLN: "폴란드 즈워티",
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
        TRY: "튀르키예 리라",
        TTD: "트리니다드 토바고 달러",
        TVD: "투발루 달러",
        TWD: "신 타이완 달러",
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
        YER: "예멘 리얄",
        ZAR: "남아프리카공화국 랜드",
        ZMW: "잠비아 콰차",
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
            ); // ABC 순으로 초기 정렬

            setData(sortedRates);
        } catch (err) {
            console.error("Error fetching exchange rate data:", err);
            setError("데이터를 가져오는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 정렬 전환 버튼 클릭 시
    const toggleSortOrder = () => {
        if (isSortedByABC) {
            // 상승률 순으로 정렬
            const sortedByRate = [...data].sort(
                (a, b) => b.changePercentage - a.changePercentage
            );
            setData(sortedByRate);
        } else {
            // ABC 순으로 정렬
            const sortedByABC = [...data].sort((a, b) =>
                a.currency.localeCompare(b.currency)
            );
            setData(sortedByABC);
        }
        setIsSortedByABC(!isSortedByABC);
    };

    // 세부정보 보기
    const showDetails = (currency, yesterdayRate, todayRate) => {
        const countryName = currencyNames[currency] || "국가 이름을 찾을 수 없음";
        setDetails({ currency, countryName, yesterdayRate, todayRate });
    };

    // 모달 닫기
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

    return (
        <div className="main-page">
            <h1>국가 별 전날 대비 환율 상승률</h1>
            {loading && <p>데이터를 가져오는 중입니다...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <>
                    {/* 차트 보기/숨기기 버튼 */}
                    <button
                        className="chart-toggle-button"
                        onClick={() => setShowChart(!showChart)}
                    >
                        {showChart ? "차트 숨기기" : "차트 보기"}
                    </button>

                    {/* 차트 표시 */}
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

                    {/* 정렬 버튼 */}
                    <button className="sort-button" onClick={toggleSortOrder}>
                        {isSortedByABC ? "상승률 순으로 정렬" : "ABC 순으로 정렬"}
                    </button>

                    {/* 데이터 테이블 */}
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
                        {data.map(({ currency, changePercentage, yesterdayRate, todayRate }, index) => (
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

                    {/* 세부정보 모달 */}
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
                </>
            )}

            {!loading && !error && data.length === 0 && (
                <p>표시할 데이터가 없습니다.</p>
            )}
        </div>
    );
}

export default MainPage;
