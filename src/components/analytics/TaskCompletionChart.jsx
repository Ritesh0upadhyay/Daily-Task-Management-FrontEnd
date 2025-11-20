import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data format:
// [{ date: '2025-11-10', completed: 3 }, { date: '2025-11-11', completed: 5 }, ...]

function TaskCompletionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#4ade80"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TaskCompletionChart;
