import { observer } from "mobx-react-lite";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { store } from "../stores/store";

export const AppLineChart: React.FC = observer(() => {
  // Convert the store map to an array suitable for Recharts
  const chartData = Array.from(store.stocks.values()).map(item => ({
    name: item.datetime,
    close: item.close
  }));

  return (
    <LineChart width={800} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="close" stroke="#8884d8" />
    </LineChart>
  );
});