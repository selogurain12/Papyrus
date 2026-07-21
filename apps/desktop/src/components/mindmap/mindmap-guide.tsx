import { HelpCircle } from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";

type MindMapGuideVariant = "list" | "editor" | "viewer";

type GuideStep = {
  element: string;
  key: string;
  side?: "top" | "right" | "bottom" | "left";
};

const guideSteps: Record<MindMapGuideVariant, GuideStep[]> = {
  list: [
    { element: "mindmap-guide-button", key: "list.help", side: "bottom" },
    { element: "mindmap-page-intro", key: "list.intro", side: "bottom" },
    { element: "mindmap-create-panel", key: "list.createPanel", side: "bottom" },
    { element: "mindmap-create-button", key: "list.createButton", side: "top" },
    { element: "mindmap-existing-list", key: "list.existingList", side: "top" },
    { element: "mindmap-card-actions", key: "list.cardActions", side: "left" },
  ],
  editor: [
    { element: "mindmap-guide-button", key: "editor.help", side: "bottom" },
    { element: "mindmap-editor-header", key: "editor.header", side: "bottom" },
    { element: "mindmap-editor-canvas", key: "editor.canvas", side: "top" },
    { element: "mindmap-editor-canvas", key: "editor.nodes", side: "top" },
    { element: "mindmap-editor-canvas", key: "editor.relations", side: "top" },
    { element: "mindmap-editor-canvas", key: "editor.shortcuts", side: "top" },
    { element: "mindmap-editor-save", key: "editor.save", side: "top" },
  ],
  viewer: [
    { element: "mindmap-guide-button", key: "viewer.help", side: "bottom" },
    { element: "mindmap-viewer-header", key: "viewer.header", side: "bottom" },
    { element: "mindmap-viewer-canvas", key: "viewer.canvas", side: "top" },
    { element: "mindmap-viewer-download", key: "viewer.download", side: "bottom" },
    { element: "mindmap-viewer-close", key: "viewer.close", side: "bottom" },
  ],
};

function selector(name: string) {
  return `[data-mindmap-guide="${name}"]`;
}

export function MindMapGuideButton({ variant }: { variant: MindMapGuideVariant }) {
  const { t } = useTranslation(["mindmap/mindmap-guide", "common"]);

  function startGuide() {
    const steps = guideSteps[variant].map((step) => ({
      element: selector(step.element),
      popover: {
        title: t(`${step.key}.title`),
        description: t(`${step.key}.description`),
        side: step.side ?? "bottom",
      },
    }));

    driver({
      animate: true,
      duration: 450,
      showProgress: true,
      skipMissingElement: true,
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 8,
      nextBtnText: t("common:next"),
      prevBtnText: t("common:previous"),
      doneBtnText: t("common:finish"),
      progressText: t("common:tour.progress"),
      steps,
    }).drive();
  }

  return (
    <Button
      type="button"
      variant="outline"
      data-mindmap-guide="mindmap-guide-button"
      onClick={startGuide}
      title={t("button")}
    >
      <HelpCircle className="mr-2 h-4 w-4" />
      {t("button")}
    </Button>
  );
}
