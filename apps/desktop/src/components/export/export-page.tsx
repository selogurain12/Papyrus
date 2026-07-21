/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import {
  Book,
  FileText,
  File,
  Check,
  type LucideIcon,
  Download,
  Settings,
  Users,
  MapPin,
  Package,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card } from "../ui/card";
import { useEffect, useMemo, useState } from "react";
import { client } from "../../utils/client/client";
import { queryKeys } from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { useAuth } from "../../context/auth-provider";
import { useFilterExportDto } from "../../utils/filters/use-filter-export";
import { useTranslation } from "react-i18next";

interface ExportFormat {
  id: "pdf" | "word" | "epub" | "txt";
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  descriptionKey: string;
}

type ExportOption = "characters" | "places" | "objects" | "events" | "notes" | "researchs";

interface ExportParam {
  id: ExportOption;
  labelKey: string;
  icon: LucideIcon;
}

const exportFormats: ExportFormat[] = [
  {
    id: "pdf",
    label: "PDF",
    icon: FileText,
    color: "text-red-600",
    bgColor: "bg-red-100",
    descriptionKey: "formats.pdf.description",
  },
  {
    id: "word",
    label: "Word (.docx)",
    icon: File,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    descriptionKey: "formats.word.description",
  },
  {
    id: "epub",
    label: "EPUB",
    icon: Book,
    color: "text-green-600",
    bgColor: "bg-green-100",
    descriptionKey: "formats.epub.description",
  },
  {
    id: "txt",
    label: "TXT",
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    descriptionKey: "formats.txt.description",
  },
];

const exportParams: ExportParam[] = [
  {
    id: "characters",
    labelKey: "params.characters",
    icon: Users,
  },
  {
    id: "places",
    labelKey: "params.places",
    icon: MapPin,
  },
  {
    id: "objects",
    labelKey: "params.objects",
    icon: Package,
  },
  {
    id: "events",
    labelKey: "params.events",
    icon: Clock,
  },
  {
    id: "notes",
    labelKey: "params.notes",
    icon: FileText,
  },
  {
    id: "researchs",
    labelKey: "params.researchs",
    icon: BookOpen,
  },
];

const WORDS_PER_PAGE = 300;
const SECTION_COVER_PAGE_ESTIMATE = 1;
const ANNEX_PAGE_ESTIMATES: Record<ExportOption, number> = {
  characters: 1,
  places: 1,
  objects: 0.75,
  events: 0.5,
  notes: 0.5,
  researchs: 0.5,
};

function getExportExtension(format: ExportFormat["id"]) {
  if (format === "pdf") {
    return "pdf";
  }

  if (format === "epub") {
    return "epub";
  }

  if (format === "word") {
    return "docx";
  }

  return "txt";
}

function getBlobFromBody(body: unknown, format: ExportFormat["id"]): Blob {
  if (body instanceof Blob) {
    return body;
  }

  if (body instanceof ArrayBuffer) {
    return new Blob([body]);
  }

  return new Blob([String(body)], {
    type: format === "txt" ? "text/plain;charset=utf-8" : undefined,
  });
}

function getListTotal(list: { body?: { total?: number } } | undefined) {
  return list?.body?.total ?? 0;
}

export function ExportPage() {
  const { t } = useTranslation(["export/export-page", "common"]);
  const { currentProject } = useProject();
  const { user } = useAuth();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>();
  const [exportFile, setExportFile] = useState(false);
  const [exportAttempt, setExportAttempt] = useState(0);

  const { setCharacters, setEvents, setNotes, setObjects, setPlaces, setResearchs, options } =
    useFilterExportDto();

  if (currentProject === null) {
    return <div>{t("noProject")}</div>;
  }

  if (user === null) {
    return <div>{t("common:notConnected")}</div>;
  }

  const { data: chapters } = client.chapter.getAll.useQuery({
    queryKey: queryKeys.chapter.getAll({
      pathParams: { projectId: currentProject.id },
    }),
    queryData: {
      params: { projectId: currentProject.id },
    },
  });

  const { data: characters } = client.character.getAll.useQuery({
    queryKey: queryKeys.character.getAll({
      pathParams: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    },
    enabled: Boolean(options.characters),
  });

  const { data: places } = client.place.getAll.useQuery({
    queryKey: queryKeys.place.getAll({
      pathParams: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    },
    enabled: Boolean(options.places),
  });

  const { data: objects } = client.object.getAll.useQuery({
    queryKey: queryKeys.object.getAll({
      pathParams: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    },
    enabled: Boolean(options.objects),
  });

  const { data: events } = client.event.getAll.useQuery({
    queryKey: queryKeys.event.getAll({
      pathParams: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    },
    enabled: Boolean(options.events),
  });

  const { data: notes } = client.note.getAll.useQuery({
    queryKey: queryKeys.note.getAll({
      pathParams: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    },
    enabled: Boolean(options.notes),
  });

  const { data: researchs } = client.research.getAll.useQuery({
    queryKey: queryKeys.research.getAll({
      pathParams: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    }),
    queryData: {
      params: { projectId: currentProject.id },
      query: { page: 1, itemsPerPage: 5 },
    },
    enabled: Boolean(options.researchs),
  });

  const estimatedPages = useMemo(() => {
    const manuscriptPages = Math.ceil((currentProject.currentWordCount ?? 0) / WORDS_PER_PAGE);
    const annexTotals: Record<ExportOption, number> = {
      characters: getListTotal(characters),
      places: getListTotal(places),
      objects: getListTotal(objects),
      events: getListTotal(events),
      notes: getListTotal(notes),
      researchs: getListTotal(researchs),
    };

    const annexPages = exportParams.reduce((total, parameter) => {
      if (!options[parameter.id]) {
        return total;
      }

      const itemCount = annexTotals[parameter.id];

      if (itemCount === 0) {
        return total;
      }

      return (
        total +
        SECTION_COVER_PAGE_ESTIMATE +
        Math.ceil(itemCount * ANNEX_PAGE_ESTIMATES[parameter.id])
      );
    }, 0);

    return manuscriptPages + annexPages;
  }, [
    characters,
    places,
    objects,
    events,
    notes,
    researchs,
    options,
    currentProject.currentWordCount,
  ]);

  const { data: epubData, isSuccess: isEpubSuccess } = client.export.epub.useQuery({
    queryKey: [
      queryKeys.export.epub({
        pathParams: {
          userId: user.id,
          projectId: currentProject.id,
        },
        query: options,
      }),
      exportAttempt,
    ],
    queryData: {
      params: {
        userId: user.id,
        projectId: currentProject.id,
      },
      query: options,
    },
    enabled: exportFile && selectedFormat?.id === "epub",
  });

  const { data: pdfData, isSuccess: isPdfSuccess } = client.export.pdf.useQuery({
    queryKey: [
      queryKeys.export.pdf({
        pathParams: {
          userId: user.id,
          projectId: currentProject.id,
        },
        query: options,
      }),
      exportAttempt,
    ],
    queryData: {
      params: {
        userId: user.id,
        projectId: currentProject.id,
      },
      query: options,
    },
    enabled: exportFile && selectedFormat?.id === "pdf",
  });

  const { data: docxData, isSuccess: isDocxSuccess } = client.export.docx.useQuery({
    queryKey: [
      queryKeys.export.docx({
        pathParams: {
          userId: user.id,
          projectId: currentProject.id,
        },
        query: options,
      }),
      exportAttempt,
    ],
    queryData: {
      params: {
        userId: user.id,
        projectId: currentProject.id,
      },
      query: options,
    },
    enabled: exportFile && selectedFormat?.id === "word",
  });

  const { data: txtData, isSuccess: isTxtSuccess } = client.export.txt.useQuery({
    queryKey: [
      queryKeys.export.txt({
        pathParams: {
          userId: user.id,
          projectId: currentProject.id,
        },
        query: options,
      }),
      exportAttempt,
    ],
    queryData: {
      params: {
        userId: user.id,
        projectId: currentProject.id,
      },
      query: options,
    },
    enabled: exportFile && selectedFormat?.id === "txt",
  });

  useEffect(() => {
    const exportData =
      selectedFormat?.id === "pdf"
        ? pdfData
        : selectedFormat?.id === "word"
          ? docxData
          : selectedFormat?.id === "txt"
            ? txtData
            : epubData;

    const isSuccess =
      selectedFormat?.id === "pdf"
        ? isPdfSuccess
        : selectedFormat?.id === "word"
          ? isDocxSuccess
          : selectedFormat?.id === "txt"
            ? isTxtSuccess
            : isEpubSuccess;

    if (!isSuccess || !exportData || !selectedFormat) {
      return;
    }

    const blob = getBlobFromBody(exportData.body, selectedFormat.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const extension = getExportExtension(selectedFormat.id);

    link.href = url;
    link.download = `${currentProject.title}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setExportFile(false);
  }, [
    isEpubSuccess,
    isPdfSuccess,
    isDocxSuccess,
    isTxtSuccess,
    epubData,
    pdfData,
    docxData,
    txtData,
    selectedFormat,
    currentProject.title,
  ]);

  function toggleOption(id: ExportOption, checked: boolean) {
    if (id === "characters") {
      setCharacters(checked);
    }

    if (id === "places") {
      setPlaces(checked);
    }

    if (id === "objects") {
      setObjects(checked);
    }

    if (id === "events") {
      setEvents(checked);
    }

    if (id === "notes") {
      setNotes(checked);
    }

    if (id === "researchs") {
      setResearchs(checked);
    }
  }

  function handleExport() {
    if (!selectedFormat) {
      return;
    }

    setExportAttempt((value) => value + 1);
    setExportFile(true);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6" data-tour="page-header">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-md">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex justify-between space-x-4 space-y-4">
        <div
          className="w-2/3 bg-white h-fit rounded-lg border border-gray-200 p-4"
          data-tour="export-formats"
        >
          <p className="font-bold text-lg p-2">{t("formatTitle")}</p>

          <div className="grid grid-cols-2 gap-4 auto-rows-fr">
            {exportFormats.map((format) => {
              const FileIcon = format.icon;

              return (
                <Card
                  key={format.id}
                  className={`p-4 border-2 h-full flex flex-col justify-between cursor-pointer ${
                    selectedFormat && selectedFormat.id === format.id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setSelectedFormat(format)}
                >
                  <div className="flex justify-between">
                    <div className={`p-4 ${format.bgColor} w-fit rounded-lg`}>
                      <FileIcon className={format.color} />
                    </div>

                    {selectedFormat && selectedFormat.id === format.id ? (
                      <div className="bg-blue-500 rounded-full flex items-center justify-center w-8 h-8">
                        <Check className="text-white" size={18} strokeWidth={3} />
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="font-semibold">{format.label}</p>
                    <p className="font-light text-gray-600">{t(format.descriptionKey)}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div
          className="w-1/3 bg-white h-fit rounded-lg border border-gray-200 p-4"
          data-tour="export-preview"
        >
          <p className="font-bold text-lg pb-2">{t("previewTitle")}</p>

          <div className="space-y-2 pb-3">
            <div className="flex justify-between">
              <p className="font-medium">{t("format")}</p>
              <p>{selectedFormat ? selectedFormat.label : t("noFormat")}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium">{t("chapters")}</p>
              <p>{chapters?.body.total}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium">{t("totalWords")}</p>
              <p>{currentProject.currentWordCount}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium">{t("estimatedPages")}</p>
              <p>{estimatedPages}</p>
            </div>
          </div>

          <Button
            variant="blue"
            className="w-full flex"
            disabled={!selectedFormat}
            onClick={handleExport}
          >
            <Download className="mr-2" />
            {t("exportProject")}
          </Button>
        </div>
      </div>

      <div
        className="w-2/3 bg-white h-fit rounded-lg border border-gray-200 p-4"
        data-tour="export-options"
      >
        <div className="flex items-center">
          <Settings />
          <p className="font-bold text-lg p-2">{t("optionsTitle")}</p>
        </div>

        <div className="pt-2">
          <p className="font-medium text-gray-600">{t("annexes")}</p>

          <div className="grid grid-cols-2 gap-4 py-6">
            {exportParams.map((params) => {
              const Icon = params.icon;

              return (
                <FieldGroup key={params.id}>
                  <FieldLabel>
                    <Field orientation="horizontal" className="flex items-center">
                      <Checkbox
                        id={params.id}
                        name={params.id}
                        checked={options[params.id]}
                        onCheckedChange={(checked) => {
                          toggleOption(params.id, checked === true);
                        }}
                      />

                      <FieldContent>
                        <FieldDescription className="flex items-center space-x-2">
                          <Icon />
                          <span>{t(params.labelKey)}</span>
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </FieldGroup>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
