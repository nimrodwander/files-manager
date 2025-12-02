import { PieChart, Pie, Tooltip } from "recharts";

const data = [
  { name: "Group A", value: 40 },
  { name: "Group B", value: 25 },
  { name: "Group C", value: 35 },
];

export const AppPieChart: React.FC = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={120} fill="#82ca9d" label />
      <Tooltip />
    </PieChart>
  );
}