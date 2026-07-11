"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DepartmentData } from "@/types/dashboard";

interface Props {
  data: DepartmentData[];
}

export default function DepartmentChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5 h-80">
      <h3 className="text-lg font-semibold mb-4">Employees by Department</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department"
                  tick={{fontSize:8}}
                  angle={-20}
  textAnchor="end"
  height={65}
  interval={0}
/>
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}