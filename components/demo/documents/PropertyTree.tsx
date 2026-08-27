"use client";

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeProperty } from "@/data/demoProperties";
import { INTEGRATION_EVENTS } from "@/data/demoProperties";

type PropertyTreeProps = {
  properties: TreeProperty[];
  integratedEventIds: string[];
  /** Active integration event — green flash only while this is set during integrating */
  highlightedEventId: string | null;
  isIntegrating?: boolean;
  revealedIntegrationDocIds: string[];
  selectedDocumentId: string | null;
  compact?: boolean;
  className?: string;
};

function getExpandedIds(
  properties: TreeProperty[],
  integratedEventIds: string[],
  highlightedEventId: string | null,
  selectedDocumentId: string | null,
): Set<string> {
  const expanded = new Set<string>();

  for (const eventId of integratedEventIds) {
    const event = INTEGRATION_EVENTS.find((e) => e.id === eventId);
    if (!event) continue;
    expanded.add(event.propertyId);
    if (event.unitLabel === "Building documents") {
      expanded.add(`${event.propertyId}-building`);
    } else {
      expanded.add(`${event.propertyId}-${event.unitId}`);
    }
  }

  for (const property of properties) {
    let propertyHasContent = false;

    for (const unit of property.units) {
      const hasSelectedDoc = unit.tenant?.documents.some(
        (d) => d.id === selectedDocumentId,
      );
      const hasHighlightedDoc =
        highlightedEventId &&
        INTEGRATION_EVENTS.some(
          (e) =>
            e.id === highlightedEventId &&
            e.propertyId === property.id &&
            e.unitId === unit.id,
        );

      if (hasSelectedDoc || hasHighlightedDoc) {
        expanded.add(property.id);
        expanded.add(`${property.id}-${unit.id}`);
      }
      if (hasSelectedDoc) propertyHasContent = true;
    }

    if (
      property.buildingDocuments?.some((d) => d.id === selectedDocumentId) ||
      (highlightedEventId &&
        INTEGRATION_EVENTS.some(
          (e) =>
            e.id === highlightedEventId &&
            e.propertyId === property.id &&
            e.unitLabel === "Building documents",
        ))
    ) {
      expanded.add(property.id);
      expanded.add(`${property.id}-building`);
      propertyHasContent = true;
    }

    if (propertyHasContent || property.units.length > 0 || property.buildingDocuments?.length) {
      expanded.add(property.id);
    }
  }

  if (highlightedEventId) {
    const event = INTEGRATION_EVENTS.find((e) => e.id === highlightedEventId);
    if (event) {
      expanded.add(event.propertyId);
      if (event.unitLabel === "Building documents") {
        expanded.add(`${event.propertyId}-building`);
      } else {
        expanded.add(`${event.propertyId}-${event.unitId}`);
      }
    }
  }

  if (selectedDocumentId) {
    for (const property of properties) {
      for (const unit of property.units) {
        if (unit.tenant?.documents.some((d) => d.id === selectedDocumentId)) {
          expanded.add(property.id);
          expanded.add(`${property.id}-${unit.id}`);
        }
      }
      if (property.buildingDocuments?.some((d) => d.id === selectedDocumentId)) {
        expanded.add(property.id);
        expanded.add(`${property.id}-building`);
      }
    }
  }

  return expanded;
}

function isDocIntegrating(
  isIntegrating: boolean,
  highlightedEventId: string | null,
  documentId: string,
): boolean {
  if (!isIntegrating || !highlightedEventId) return false;
  const event = INTEGRATION_EVENTS.find((e) => e.id === highlightedEventId);
  return event?.documentId === documentId;
}

function docRowClassName(
  selectedDocumentId: string | null,
  highlightedEventId: string | null,
  isIntegrating: boolean,
  documentId: string,
  extra?: string,
): string {
  return cn(
    "integration-doc flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[11px] transition-colors duration-200",
    extra,
    selectedDocumentId === documentId
      ? "bg-[#EFEFED] font-medium text-[#1A1A1A]"
      : "text-[#6B7280]",
    isDocIntegrating(isIntegrating, highlightedEventId, documentId) &&
      "bg-[#E8F5EC] text-[#0F291E]",
  );
}

export function PropertyTree({
  properties,
  integratedEventIds,
  highlightedEventId,
  isIntegrating = false,
  revealedIntegrationDocIds: _revealedIntegrationDocIds,
  selectedDocumentId,
  compact = false,
  className,
}: PropertyTreeProps) {
  const expanded = getExpandedIds(
    properties,
    integratedEventIds,
    highlightedEventId,
    selectedDocumentId,
  );

  return (
    <aside
      className={cn(
        "property-tree-panel flex h-full shrink-0 flex-col border-r border-[#E8E8E6] bg-[#FAFAF8]",
        compact ? "w-[220px]" : "w-[240px]",
        className,
      )}
    >
      <div className="border-b border-[#E8E8E6] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          All properties
        </p>
        <button
          type="button"
          className="mt-1 flex items-center gap-1 text-[13px] font-medium text-[#1A1A1A]"
        >
          Demo Property Management
          <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {properties.map((property) => {
          const propertyExpanded = expanded.has(property.id);

          return (
            <div key={property.id} className="mb-0.5">
              <div
                className="integration-node flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium text-[#374151]"
                data-property-id={property.id}
              >
                {propertyExpanded ? (
                  <ChevronDown className="h-3 w-3 shrink-0 text-[#9CA3AF]" />
                ) : (
                  <ChevronRight className="h-3 w-3 shrink-0 text-[#9CA3AF]" />
                )}
                <Folder className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
                <span className="truncate">{property.name}</span>
              </div>

              {propertyExpanded && property.buildingDocuments && (
                <div className="ml-4">
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[#6B7280]">
                    <ChevronDown className="h-3 w-3 text-[#C4C4C4]" />
                    <span>Building documents</span>
                  </div>
                  {property.buildingDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      className={docRowClassName(
                        selectedDocumentId,
                        highlightedEventId,
                        isIntegrating,
                        doc.id,
                        "ml-4",
                      )}
                      data-document-id={doc.id}
                    >
                      <File className="h-3 w-3 shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {propertyExpanded &&
                property.units.map((unit) => {
                  const unitKey = `${property.id}-${unit.id}`;
                  const unitExpanded = expanded.has(unitKey);

                  return (
                    <div key={unit.id} className="ml-4">
                      <div className="integration-node flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[#6B7280]">
                        {unitExpanded ? (
                          <ChevronDown className="h-3 w-3 text-[#C4C4C4]" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-[#C4C4C4]" />
                        )}
                        <span className="truncate">
                          {unit.label}
                          {unit.tenant ? ` · ${unit.tenant.name}` : ""}
                        </span>
                      </div>

                      {unitExpanded && unit.tenant && (
                        <div className="ml-4">
                          {unit.tenant.documents.map((doc) => (
                            <button
                              key={doc.id}
                              type="button"
                              className={docRowClassName(
                                selectedDocumentId,
                                highlightedEventId,
                                isIntegrating,
                                doc.id,
                              )}
                              data-document-id={doc.id}
                            >
                              <File className="h-3 w-3 shrink-0" />
                              <span className="truncate">{doc.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function PropertyTreePlaceholder() {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[#E8E8E6] bg-[#FAFAF8]">
      <div className="border-b border-[#E8E8E6] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          All properties
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 text-center text-[11px] text-[#9CA3AF]">
        <Upload className="mr-1.5 h-3.5 w-3.5" />
        Documents will appear here after upload
      </div>
    </aside>
  );
}
