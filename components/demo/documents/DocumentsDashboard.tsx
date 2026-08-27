"use client";

import { ChevronDown, Flag, Search, Upload } from "lucide-react";
import { forwardRef } from "react";
import {
  DASHBOARD_DOCUMENTS,
  STATUS_COUNTS,
} from "@/data/demoDocuments";
import { cn } from "@/lib/utils";

type DocumentsDashboardProps = {
  uploadButtonHovered?: boolean;
  onUploadClick?: () => void;
};

export const DocumentsDashboard = forwardRef<
  HTMLButtonElement,
  DocumentsDashboardProps
>(function DocumentsDashboard(
  { uploadButtonHovered = false, onUploadClick },
  uploadRef,
) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-start justify-between px-8 pb-4 pt-7">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-[#1A1A1A]">
              Documents
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[280px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  readOnly
                  placeholder="Search by name, property, tenant..."
                  className="w-full rounded-lg border border-[#E8E8E6] bg-white py-2 pl-9 pr-3 text-[13px] text-[#374151] placeholder:text-[#9CA3AF] outline-none"
                />
              </div>
              {["All properties", "Any source", "All types"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-[#E8E8E6] bg-white px-3 py-2 text-[12px] font-medium text-[#374151]"
                >
                  {filter}
                  <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </div>

          <button
            ref={uploadRef}
            type="button"
            onClick={onUploadClick}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium text-white transition-all duration-150",
              uploadButtonHovered
                ? "scale-[0.98] bg-[#333333]"
                : "bg-[#1A1A1A] hover:bg-[#333333]",
            )}
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            Upload
          </button>
        </header>

        <div className="flex items-center gap-2 px-8 pb-4">
          <StatusPill
            label={`${STATUS_COUNTS.review} Review`}
            variant="review"
          />
          <StatusPill
            label={`${STATUS_COUNTS.flagged} Flagged`}
            variant="flagged"
          />
          <StatusPill
            label={`${STATUS_COUNTS.approved} Approved`}
            variant="approved"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-8 pb-6">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              className="flex items-center gap-1 text-[12px] text-[#6B7280]"
            >
              Most recent
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#E8E8E6] bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EFEFED] text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Unit</th>
                  <th className="px-4 py-3 font-semibold">Added</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {DASHBOARD_DOCUMENTS.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-[#F5F5F3] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-[#1A1A1A]">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        Uploaded document
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-[#F5F5F3] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#6B7280]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                      {doc.unit}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">
                      {doc.added}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                          doc.status === "review"
                            ? "bg-[#FEF3C7] text-[#92400E]"
                            : "bg-[#DCFCE7] text-[#166534]",
                        )}
                      >
                        {doc.status === "review" ? "Review" : "Approved"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[#C4C4C4]">
                        <Flag className="h-3.5 w-3.5" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
});

function StatusPill({
  label,
  variant,
}: {
  label: string;
  variant: "review" | "flagged" | "approved";
}) {
  const styles = {
    review: "border-[#F5E6C8] bg-[#FDF8F0] text-[#9B6B42]",
    flagged: "border-[#F5D5D5] bg-[#FDF5F5] text-[#9B4A4A]",
    approved: "border-[#D4E8DA] bg-[#F0F7F2] text-[#2D5A3D]",
  };

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-[12px] font-medium",
        styles[variant],
      )}
    >
      {label}
    </span>
  );
}

function RightSidebar() {
  const days = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" },
  ];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const actionQueue = [
    { date: "AUG 4", name: "Harbourview Lease Renewal.pdf", status: "review" as const },
    { date: "AUG 5", name: "82 King Street Lease.pdf", status: "review" as const },
    { date: "AUG 8", name: "Mayfair Tenant Amendment.pdf", status: "review" as const },
    { date: "AUG 9", name: "Northgate Parking Agreement.pdf", status: "review" as const },
    { date: "AUG 10", name: "Summit Tower Lease Abstract.pdf", status: "review" as const },
    { date: "AUG 11", name: "Lakeside SNDA.pdf", status: "review" as const },
    { date: "AUG 12", name: "Westmount Notice.pdf", status: "approved" as const },
    { date: "AUG 13", name: "Riverside Rent Roll.xlsx", status: "approved" as const },
    { date: "AUG 14", name: "Cedar Lane Insurance Certificate.pdf", status: "approved" as const },
    { date: "AUG 15", name: "Oakwood Sublease.pdf", status: "approved" as const },
    { date: "AUG 16", name: "Parkview Estoppel Certificate.pdf", status: "approved" as const },
    { date: "AUG 17", name: "Brookfield Operating Statement.xlsx", status: "approved" as const },
  ];

  return (
    <aside className="hidden h-full w-[260px] shrink-0 flex-col border-l border-[#E8E8E6] bg-[#FAFAF8] p-5 xl:flex">
      <div className="shrink-0 rounded-xl border border-[#E8E8E6] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[#1A1A1A]">
            August 2026
          </p>
          <span className="rounded-md bg-[#EFEFED] px-2 py-0.5 text-[10px] font-medium text-[#6B7280]">
            Today
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#9CA3AF]">
          {days.map((d) => (
            <span key={d.key}>{d.label}</span>
          ))}
          {dates.map((d) => (
            <span
              key={d}
              className={cn(
                "flex h-6 items-center justify-center rounded-full",
                d === 20 && "bg-[#1A1A1A] font-medium text-white",
              )}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <p className="mb-2 shrink-0 text-[12px] font-semibold text-[#374151]">
          Action queue{" "}
          <span className="font-normal text-[#9CA3AF]">12</span>
        </p>
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {actionQueue.map((item) => (
            <div
              key={item.name}
              className="flex flex-1 items-center gap-2 rounded-lg border border-[#EFEFED] bg-white p-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-md bg-[#F5F5F3] text-[8px] font-bold leading-tight text-[#6B7280]">
                {item.date.split(" ")[0]}
                <span className="text-[10px]">{item.date.split(" ")[1]}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-[#374151]">
                  {item.name}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">
                  {item.status === "review" ? "Needs review" : "Approved"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
