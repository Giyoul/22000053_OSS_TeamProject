import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {useEffect, useState} from "react";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const MainPage = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentResponse = await axios.get(
                    "https://6747ce2938c8741641d7b978.mockapi.io/api/currentdata"
                );

                const lastResponse = await axios.get(
                    "https://6747ce2938c8741641d7b978.mockapi.io/api/lastdata"
                );

                const currentRates = currentResponse.data[0].conversion_rates;
                const lastRates = lastResponse.data[0].conversion_rates;

                const rateChanges = Object.keys(currentRates)
                    .map((currency) => {
                        if (currency !== "KRW" && lastRates[currency]) {
                            const currentRate = currentRates[currency];
                            const lastRate = lastRates[currency];
                            const percentageChange =
                                ((currentRate - lastRate) / lastRate) * 100;

                            return {
                                currency,
                                percentageChange: parseFloat(percentageChange.toFixed(2)),
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                const sortedRates = rateChanges.sort(
                    (a, b) => b.percentageChange - a.percentageChange
                );

                setData(sortedRates);
            } catch (err) {
                setError("Failed to fetch data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading data...</div>;
    if (error) return <div className="error">{error}</div>;

    const chartData = {
        labels: data.slice(0, 10).map((item) => item.currency),
        datasets: [
            {
                label: "Daily Change (%)",
                data: data.slice(0, 10).map((item) => item.percentageChange),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <div className="main-container">
            <header className="header">
                <h1>Exchange Rate Performance</h1>
            </header>

            <div className="container">
                <h2>Top 10 Investment Opportunities (Daily Change)</h2>

                <div className="chart-container">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <table className="rate-table">
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Currency</th>
                        <th>Daily Change (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={item.currency}>
                            <td>{index + 1}</td>
                            <td>{item.currency}</td>
                            <td>{item.percentageChange}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MainPage;