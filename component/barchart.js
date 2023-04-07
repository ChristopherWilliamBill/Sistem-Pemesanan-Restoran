import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({dataTopMenu}) {
  let labels = []
  for(let i = 0; i < dataTopMenu.length; i++){
    labels.push(dataTopMenu[i].namaMenu)
  }

  let dataD = []
  for(let i = 0; i < dataTopMenu.length; i++){
    dataD.push(dataTopMenu[i].jumlah)
  }

  const data = {
    labels: labels,

    datasets: [
      {
        label: 'Order',
        data: dataD,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ], 
  };

  return <Bar data={data} />;
}
