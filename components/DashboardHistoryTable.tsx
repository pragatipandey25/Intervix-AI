import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DashboardHistoryRow {
  id: string;
  role: string;
  type: string;
  date: string;
  score: string;
  status: string;
}

interface DashboardHistoryTableProps {
  rows: DashboardHistoryRow[];
}

const DashboardHistoryTable = ({ rows }: DashboardHistoryTableProps) => {
  return (
    <div className="card-border w-full">
      <div className="card flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
              Recent Activity
            </p>
            <h3 className="mt-1 text-primary-100">Recent interview history</h3>
          </div>
          <Link
            href="/interview/history"
            className="inline-flex items-center gap-2 text-sm text-light-100/80 transition-colors hover:text-primary-100"
          >
            View all
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.18em] text-light-100/60">
                <tr>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Score</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={
                      index !== rows.length - 1 ? "border-b border-white/8" : ""
                    }
                  >
                    <td className="px-5 py-4 text-sm font-medium text-primary-100">
                      {row.role}
                    </td>
                    <td className="px-5 py-4 text-sm text-light-100/80">
                      {row.type}
                    </td>
                    <td className="px-5 py-4 text-sm text-light-100/80">
                      {row.date}
                    </td>
                    <td className="px-5 py-4 text-sm text-light-100/80">
                      {row.score}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-light-100/80">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHistoryTable;
