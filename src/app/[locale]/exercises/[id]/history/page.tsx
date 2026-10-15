"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getEntries, deleteEntry, exportAll, type Entry } from "@/lib/api";
import { buildExportFilename, downloadJson } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const PAGE_SIZE = 20;

export default function HistoryPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations("history");
  const tc = useTranslations("common");
  const [offset, setOffset] = useState(0);
  const [exportError, setExportError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: entries, isLoading, error } = useQuery({
    queryKey: ["entries", params.id, offset],
    queryFn: () =>
      getEntries({ exerciseId: params.id, limit: PAGE_SIZE, offset }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", params.id] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t("deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = (entry: Entry) => {
    downloadJson(`entry-${entry.id}.json`, entry);
  };

  const handleExportAll = async () => {
    setExportError(false);
    setIsExporting(true);
    try {
      const data = await exportAll();
      downloadJson(buildExportFilename(), data);
    } catch {
      setExportError(true);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="h-8 w-32" />
        <div className="mt-6">
          <SkeletonList />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EmptyState
          title={t("errorTitle")}
          description={t("errorDescription")}
          action={
            <Button onClick={() => queryClient.invalidateQueries()}>
              {tc("retry")}
            </Button>
          }
        />
      </div>
    );
  }

  const entryList = entries ?? [];
  const hasMore = entryList.length === PAGE_SIZE;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Button variant="link" className="mb-6 p-0" asChild>
        <Link href={`/exercises/${params.id}`}>← {t("backToExercise")}</Link>
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting}>
          {isExporting ? `${tc("export")}…` : t("exportAll")}
        </Button>
      </div>
      {exportError && (
        <p role="alert" className="mb-4 text-sm text-error">
          {t("exportError")}
        </p>
      )}

      {entryList.length === 0 ? (
        <EmptyState
          title={t("empty")}
          description={t("emptyDescription")}
        />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {entryList.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString(locale)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
                      entry.status === "completed"
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground"
                    }`}
                  >
                    {entry.status === "completed"
                      ? t("completed")
                      : t("draft")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleExport(entry)}
                  >
                    {tc("export")}
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-error"
                    onClick={() => handleDelete(entry.id)}
                  >
                    {tc("delete")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
              >
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}
