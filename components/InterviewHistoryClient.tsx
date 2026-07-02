"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Layers3,
  Search,
  SlidersHorizontal,
  Star,
  View,
} from "lucide-react";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InterviewHistoryItem {
  id: string;
  company: string;
  position: string;
  interviewType: string;
  date: string;
  duration: string;
  score: number | null;
  status: string;
  createdAt: string;
}

interface InterviewHistoryClientProps {
  user: User;
  interviews: InterviewHistoryItem[];
}

type DateFilter = "all" | "7d" | "30d" | "90d" | "1y";
type ScoreFilter = "all" | "90+" | "75-89" | "<75";

const PAGE_SIZE = 8;

const dateOptions: Array<{ value: DateFilter; label: string }> = [
  { value: "all", label: "All dates" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last 1 year" },
];

const scoreOptions: Array<{ value: ScoreFilter; label: string }> = [
  { value: "all", label: "All scores" },
  { value: "90+", label: "90 and above" },
  { value: "75-89", label: "75 to 89" },
  { value: "<75", label: "Below 75" },
];

const buildCsv = (rows: InterviewHistoryItem[]) => {
  const header = [
    "Company",
    "Position",
    "Interview Type",
    "Date",
    "Duration",
    "Score",
    "Status",
  ];

  const csvRows = rows.map((row) => [
    row.company,
    row.position,
    row.interviewType,
    row.date,
    row.duration,
    row.score !== null ? `${row.score}` : "Pending",
    row.status,
  ]);

  return [header, ...csvRows]
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
};

const matchesDateFilter = (dateValue: string, filter: DateFilter) => {
  if (filter === "all") return true;

  const selectedDate = new Date(dateValue);
  const now = new Date();
  const diffInDays =
    (now.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24);

  if (filter === "7d") return diffInDays <= 7;
  if (filter === "30d") return diffInDays <= 30;
  if (filter === "90d") return diffInDays <= 90;
  return diffInDays <= 365;
};

const matchesScoreFilter = (score: number | null, filter: ScoreFilter) => {
  if (filter === "all" || score === null)
    return filter === "all" || score === null;
  if (filter === "90+") return score >= 90;
  if (filter === "75-89") return score >= 75 && score < 90;
  return score < 75;
};

const scoreBadgeClasses = (score: number | null) => {
  if (score === null) return "border-white/10 bg-white/5 text-light-100/80";
  if (score >= 90)
    return "border-success-100/30 bg-success-100/10 text-success-100";
  if (score >= 75)
    return "border-primary-200/30 bg-primary-200/10 text-primary-100";
  return "border-destructive-100/30 bg-destructive-100/10 text-destructive-100";
};

const InterviewHistoryClient = ({
  user,
  interviews,
}: InterviewHistoryClientProps) => {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const companyOptions = useMemo(
    () => ["all", ...new Set(interviews.map((item) => item.company))],
    [interviews],
  );
  const typeOptions = useMemo(
    () => ["all", ...new Set(interviews.map((item) => item.interviewType))],
    [interviews],
  );

  const filteredInterviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return interviews.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        [item.company, item.position, item.interviewType, item.status]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCompany =
        companyFilter === "all" || item.company === companyFilter;
      const matchesType =
        typeFilter === "all" || item.interviewType === typeFilter;
      const matchesDate = matchesDateFilter(item.createdAt, dateFilter);
      const matchesScore = matchesScoreFilter(item.score, scoreFilter);

      return (
        matchesSearch &&
        matchesCompany &&
        matchesType &&
        matchesDate &&
        matchesScore
      );
    });
  }, [companyFilter, dateFilter, interviews, query, scoreFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInterviews.length / PAGE_SIZE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filteredInterviews.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleDownload = () => {
    const csv = buildCsv(filteredInterviews);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "interview-history-report.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery("");
    setDateFilter("all");
    setCompanyFilter("all");
    setTypeFilter("all");
    setScoreFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <DashboardSidebar
        user={user}
        totalInterviews={interviews.length}
        averageScore={
          interviews.length
            ? Math.round(
                interviews.reduce((sum, item) => sum + (item.score ?? 0), 0) /
                  interviews.filter((item) => item.score !== null).length || 0,
              )
            : 0
        }
        active="history"
      />

      <main className="flex flex-col gap-8">
        <section className="card-border w-full">
          <div className="card flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
                  Interview Records
                </p>
                <h2>Interview History</h2>
                <p className="mt-2 max-w-2xl">
                  Search, filter, and review your past interview sessions in a
                  clean dashboard view.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={handleDownload}
                  disabled={filteredInterviews.length === 0}
                >
                  <Download className="size-4" />
                  Download report
                </Button>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
              <label className="flex h-12 items-center gap-3 rounded-full border border-white/10 bg-dark-200 px-4 text-sm text-white focus-within:border-primary-200/50 focus-within:ring-2 focus-within:ring-primary-200/20 xl:col-span-1">
                <Search className="size-4 shrink-0 text-light-100/70" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search interviews"
                  className="h-full w-full bg-transparent outline-none placeholder:text-light-100/50"
                />
              </label>

              <label className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-dark-200 px-4 text-sm text-light-100/80 focus-within:border-primary-200/50 focus-within:ring-2 focus-within:ring-primary-200/20">
                <CalendarDays className="size-4 shrink-0 text-light-100/70" />
                <select
                  value={dateFilter}
                  onChange={(event) => {
                    setDateFilter(event.target.value as DateFilter);
                    setCurrentPage(1);
                  }}
                  className="h-full w-full bg-transparent text-white outline-none"
                >
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-dark-200 px-4 text-sm text-light-100/80 focus-within:border-primary-200/50 focus-within:ring-2 focus-within:ring-primary-200/20">
                <Layers3 className="size-4 shrink-0 text-light-100/70" />
                <select
                  value={companyFilter}
                  onChange={(event) => {
                    setCompanyFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-full w-full bg-transparent text-white outline-none"
                >
                  {companyOptions.map((company) => (
                    <option key={company} value={company}>
                      {company === "all" ? "All companies" : company}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-dark-200 px-4 text-sm text-light-100/80 focus-within:border-primary-200/50 focus-within:ring-2 focus-within:ring-primary-200/20">
                <SlidersHorizontal className="size-4 shrink-0 text-light-100/70" />
                <select
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-full w-full bg-transparent text-white outline-none"
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All types" : type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-dark-200 px-4 text-sm text-light-100/80 focus-within:border-primary-200/50 focus-within:ring-2 focus-within:ring-primary-200/20">
                <Filter className="size-4 shrink-0 text-light-100/70" />
                <select
                  value={scoreFilter}
                  onChange={(event) => {
                    setScoreFilter(event.target.value as ScoreFilter);
                    setCurrentPage(1);
                  }}
                  className="h-full w-full bg-transparent text-white outline-none"
                >
                  {scoreOptions.map((score) => (
                    <option key={score.value} value={score.value}>
                      {score.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        {filteredInterviews.length === 0 ? (
          <section className="card-border w-full">
            <div className="card flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary-100">
                <Search className="size-6" />
              </div>
              <div className="max-w-xl">
                <h3>No interviews found</h3>
                <p className="mt-2">
                  Try adjusting your filters or search term. You can also clear
                  everything and browse all sessions again.
                </p>
              </div>
              <Button
                className="btn-primary rounded-full px-5"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          </section>
        ) : (
          <>
            <section className="card-border w-full overflow-hidden">
              <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-175">
                    <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.18em] text-light-100/60">
                      <tr>
                        <th className="px-5 py-4 font-medium">Company</th>
                        <th className="px-5 py-4 font-medium">Position</th>
                        <th className="px-5 py-4 font-medium">
                          Interview Type
                        </th>
                        <th className="px-5 py-4 font-medium">Date</th>
                        <th className="px-5 py-4 font-medium">Duration</th>
                        <th className="px-5 py-4 font-medium">Score</th>
                        <th className="px-5 py-4 font-medium">Status</th>
                        <th className="px-5 py-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((row, index) => (
                        <tr
                          key={row.id}
                          className={cn(
                            index !== pageItems.length - 1 &&
                              "border-b border-white/8",
                          )}
                        >
                          <td className="px-5 py-4 text-sm font-medium text-primary-100">
                            {row.company}
                          </td>
                          <td className="px-5 py-4 text-sm text-light-100/80">
                            {row.position}
                          </td>
                          <td className="px-5 py-4 text-sm text-light-100/80">
                            {row.interviewType}
                          </td>
                          <td className="px-5 py-4 text-sm text-light-100/80">
                            {row.date}
                          </td>
                          <td className="px-5 py-4 text-sm text-light-100/80">
                            {row.duration}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <span
                              className={cn(
                                "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                                scoreBadgeClasses(row.score),
                              )}
                            >
                              {row.score !== null
                                ? `${row.score}/100`
                                : "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-light-100/80">
                            {row.status}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4"
                              >
                                <Link href={`/interview/${row.id}`}>
                                  <View className="size-4" />
                                  View
                                </Link>
                              </Button>
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4"
                              >
                                <Link href={`/interview/${row.id}/feedback`}>
                                  <Star className="size-4" />
                                  Report
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="card-border w-full">
              <div className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-light-100/75">
                  Showing {pageItems.length} of {filteredInterviews.length}{" "}
                  results
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safePage === 1}
                  >
                    <ChevronLeft className="size-4" />
                    Prev
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      const isActive = pageNumber === safePage;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setCurrentPage(pageNumber)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border text-sm transition-all duration-200",
                            isActive
                              ? "border-primary-200 bg-primary-200 text-dark-100"
                              : "border-white/10 bg-white/5 text-light-100/80 hover:bg-white/8 hover:text-white",
                          )}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={safePage === totalPages}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default InterviewHistoryClient;
