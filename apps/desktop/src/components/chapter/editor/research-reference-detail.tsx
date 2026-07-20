import { ResearchDto } from "@papyrus/source";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "../../ui/button";

export function ResearchReferenceDetail({ research }: { research: ResearchDto | undefined }) {
  const { t } = useTranslation(["chapter/chapter-editor", "research/research-card", "common"]);

  if (!research) {
    return (
      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
        {t("references.select")}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{research.title}</h3>
          {research.sources && <p className="text-sm text-slate-500">{research.sources}</p>}
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {t(`research/research-card:categories.${research.type}`, {
            defaultValue: research.type,
          })}
        </span>
      </div>

      {research.description && (
        <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{research.description}</p>
      )}

      {research.tag && research.tag.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {research.tag.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {research.note && (
        <div
          className={
            "mt-3 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-3 " +
            "text-sm text-yellow-800"
          }
        >
          {research.note}
        </div>
      )}

      {research.link && (
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full"
          onClick={() => window.open(research.link ?? "", "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t("common:openExternal")}
        </Button>
      )}
    </div>
  );
}
