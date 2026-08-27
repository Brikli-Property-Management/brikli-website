"use client";

import { ArrowLeft, Flag, Minus, Plus, RotateCw } from "lucide-react";
import {
  FOCUS_DOCUMENT_NAME,
  GROUNDING_FIELDS,
  type GroundingField,
} from "@/data/demoDocuments";
import { GroundingBox } from "./GroundingBox";

type DocumentViewerProps = {
  revealedFieldIds: string[];
  activeGroundingFieldId: string | null;
};

const FIELD_MAP = Object.fromEntries(
  GROUNDING_FIELDS.map((f) => [f.id, f]),
) as Record<string, GroundingField>;

export function DocumentViewer({
  revealedFieldIds,
  activeGroundingFieldId,
}: DocumentViewerProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F5F5F3]">
      <header className="flex items-center justify-between border-b border-[#E8E8E6] bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] text-[#6B7280]"
          >
            <ArrowLeft className="h-4 w-4" />
            Review
          </button>
          <span className="text-[#E8E8E6]">|</span>
          <p className="text-[13px] font-medium text-[#1A1A1A]">
            {FOCUS_DOCUMENT_NAME}
          </p>
          <span className="rounded-md bg-[#F5F5F3] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
            Lease
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E8E6] text-[#6B7280]"
          >
            <Flag className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 items-start justify-center overflow-auto p-8">
        <div className="relative">
          <div className="absolute -top-3 right-4 z-10 flex items-center gap-1 rounded-full border border-[#E8E8E6] bg-white px-2 py-1 shadow-sm">
            <button type="button" className="p-1 text-[#9CA3AF]">
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1 text-[#9CA3AF]">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 text-[11px] font-medium text-[#374151]">
              100%
            </span>
            <button type="button" className="p-1 text-[#9CA3AF]">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <LeaseDocument
            revealedFieldIds={revealedFieldIds}
            activeGroundingFieldId={activeGroundingFieldId}
          />
        </div>
      </div>
    </div>
  );
}

function LeaseDocument({
  revealedFieldIds,
  activeGroundingFieldId,
}: {
  revealedFieldIds: string[];
  activeGroundingFieldId: string | null;
}) {
  return (
    <div className="relative w-[520px] rounded-sm bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <div className="px-10 py-8 text-[#1A1A1A]">
        <div className="border-b-2 border-[#1E3A5F] pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1E3A5F]">
            Northstar Property Management
          </p>
        </div>

        <h1 className="mt-4 text-center text-[18px] font-bold uppercase tracking-wide">
          Residential Lease Agreement
        </h1>
        <p className="mt-1 text-center text-[10px] text-[#6B7280]">
          Ontario · Standard Form
        </p>

        <SectionHeader label="A · Landlord" />
        <FieldLine
          label="Landlord"
          value="Northstar Property Management Inc."
          fieldId="landlord"
          revealedFieldIds={revealedFieldIds}
          activeGroundingFieldId={activeGroundingFieldId}
        />

        <SectionHeader label="B · Property" />
        <FieldLine
          label="Property address"
          value="82 King Street West, Unit 4"
          fieldId="address"
          revealedFieldIds={revealedFieldIds}
          activeGroundingFieldId={activeGroundingFieldId}
        />
        <FieldLine label="City" value="Toronto, ON M5H 1A1" />

        <SectionHeader label="C · Tenant" />
        <FieldLine
          label="Tenant name"
          value="Ava Chen"
          fieldId="tenant"
          revealedFieldIds={revealedFieldIds}
          activeGroundingFieldId={activeGroundingFieldId}
        />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <FieldLine
            label="Lease start"
            value="September 1, 2026"
            fieldId="start"
            revealedFieldIds={revealedFieldIds}
            activeGroundingFieldId={activeGroundingFieldId}
          />
          <FieldLine
            label="Lease end"
            value="August 31, 2027"
            fieldId="end"
            revealedFieldIds={revealedFieldIds}
            activeGroundingFieldId={activeGroundingFieldId}
          />
        </div>

        <SectionHeader label="D · Terms" />
        <div className="mt-2 space-y-2 text-[11px] leading-relaxed text-[#374151]">
          <p>
            The tenant agrees to occupy the premises for residential purposes
            only, in accordance with the terms set forth in this agreement.
          </p>
          <p>
            Utilities included: water, heat. Tenant responsible for electricity
            and internet services.
          </p>
        </div>

        <div className="mt-6 border-t border-dashed border-[#E8E8E6] pt-6">
          <SectionHeader label="E · Rent" />
          <FieldLine
            label="Monthly rent"
            value="$2,450.00"
            fieldId="rent"
            revealedFieldIds={revealedFieldIds}
            activeGroundingFieldId={activeGroundingFieldId}
          />
          <FieldLine label="Security deposit" value="$2,450.00" />
          <FieldLine
            label="Parking"
            value="1 underground space"
            fieldId="parking"
            revealedFieldIds={revealedFieldIds}
            activeGroundingFieldId={activeGroundingFieldId}
          />

          <div className="mt-8 grid grid-cols-2 gap-8">
            <SignatureBlock label="Landlord signature" name="Northstar PM" />
            <SignatureBlock label="Tenant signature" name="Ava Chen" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mt-4 bg-[#1E3A5F] px-2 py-1">
      <p className="text-[9px] font-bold uppercase tracking-wider text-white">
        {label}
      </p>
    </div>
  );
}

function FieldLine({
  label,
  value,
  fieldId,
  revealedFieldIds = [],
  activeGroundingFieldId = null,
}: {
  label: string;
  value: string;
  fieldId?: string;
  revealedFieldIds?: string[];
  activeGroundingFieldId?: string | null;
}) {
  const field = fieldId ? FIELD_MAP[fieldId] : undefined;

  return (
    <div className="mt-2" data-field-line={fieldId}>
      <p className="text-[9px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <div className="relative mt-0.5">
        <p className="border-b border-[#D1D5DB] pb-1 text-[12px] font-medium text-[#1A1A1A]">
          {value}
        </p>
        {field && (
          <GroundingBox
            field={field}
            active={activeGroundingFieldId === field.id}
            visible={revealedFieldIds.includes(field.id)}
          />
        )}
      </div>
    </div>
  );
}

function SignatureBlock({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <div className="mt-2 border-b border-[#374151] pb-1">
        <p className="font-[family-name:var(--font-geist-mono)] text-[14px] italic text-[#374151]">
          {name}
        </p>
      </div>
      <p className="mt-1 text-[9px] text-[#9CA3AF]">Date: Aug 15, 2026</p>
    </div>
  );
}
