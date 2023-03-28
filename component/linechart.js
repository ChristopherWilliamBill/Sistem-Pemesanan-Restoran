import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({dataDailyRevenue}){
    let labels = []
    for(let i = 0; i < dataDailyRevenue.length; i++){
        labels.push(new Date(dataDailyRevenue[i].tanggal).toLocaleDateString('en-CA'))
    }

    let dataD = []
    for(let i = 0; i < dataDailyRevenue.length; i++){
        dataD.push(dataDailyRevenue[i].total)
    }

    const data = {
        labels: labels,
        datasets: [{
        label: 'Revenue',
        data: dataD,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgb(0,0,0)'
        }]
    };
    
    return(
        <Line data={data} />
    )
}