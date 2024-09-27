import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

function PieChart() {
    const chartRef = useRef(null); // Ref for the canvas element
    const chartInstanceRef = useRef(null); // Ref for the chart instance

    useEffect(() => {
        // Function to fetch budget data and create/update the chart
        const fetchBudgetData = async () => {
            try {
                const res = await axios.get('http://localhost:3001/budget');

                const dataSource = {
                    datasets: [
                        {
                            data: res.data.myBudget.map(item => item.budget),
                            backgroundColor: [
                                '#ffcd56',
                                '#ff6384',
                                '#36a2eb',
                                '#fd6b19',
                                '#4bc0c0',
                                '#9966ff',
                                '#ff9f40'
                            ]
                        }
                    ],
                    labels: res.data.myBudget.map(item => item.title)
                };

                // If a chart already exists, destroy it before creating a new one
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');

                // Create a new chart and store its reference in chartInstanceRef
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: dataSource
                });
            } catch (error) {
                console.error('Error fetching budget data:', error);
            }
        };

        // Fetch and create the chart
        fetchBudgetData();

        // Clean up when the component unmounts
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div>
            <canvas id="myChart" ref={chartRef} width="400" height="400"></canvas>
        </div>
    );
}

export default PieChart;
