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
import { useEffect, useState } from "react";
import { client } from "../../utils/client/client";
import { queryKeys } from "@papyrus/source";
import { useProject } from "../../context/project-provider";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { useAuth } from "../../context/auth-provider";
import { useFilterExportDto } from "../../utils/filters/use-filter-export";

interface ExportFormat {
  id: "pdf" | "word" | "epub" | "txt";
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

type ExportOption = "characters" | "places" | "objects" | "events" | "notes" | "researchs";

interface ExportParam {
  id: ExportOption;
  label: string;
  icon: LucideIcon;
}

const exportFormats: ExportFormat[] = [
  {
    id: "pdf",
    label: "PDF",
    icon: FileText,
    color: "#DC2626",
    bgColor: "bg-red-100",
    description: "Format universel pour lecture et impression",
  },
  {
    id: "word",
    label: "Word (.docx)",
    icon: File,
    color: "#2563EB",
    bgColor: "bg-blue-100",
    description: "Format éditable pour Microsoft Word",
  },
  {
    id: "epub",
    label: "EPUB",
    icon: Book,
    color: "#16A34A",
    bgColor: "bg-green-100",
    description: "Format standard pour liseuses électroniques",
  },
  {
    id: "txt",
    label: "Texte (.txt)",
    icon: FileText,
    color: "#4B5563",
    bgColor: "bg-gray-100",
    description: "Format texte simple sans formatage",
  },
];

const exportParams: ExportParam[] = [
  {
    id: "characters",
    label: "Liste des personnages",
    icon: Users,
  },
  {
    id: "places",
    label: "Liste des lieux",
    icon: MapPin,
  },
  {
    id: "objects",
    label: "Liste des objets",
    icon: Package,
  },
  {
    id: "events",
    label: "Chronologie",
    icon: Clock,
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
  },
  {
    id: "researchs",
    label: "Recherches",
    icon: BookOpen,
  },
];

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

export function ExportPage() {
  const { currentProject } = useProject();
  const { user } = useAuth();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>();
  const [exportFile, setExportFile] = useState(false);
  const [exportAttempt, setExportAttempt] = useState(0);

  const { setCharacters, setEvents, setNotes, setObjects, setPlaces, setResearchs, options } =
    useFilterExportDto();

  if (currentProject === null) {
    return <div>Pas de projet</div>;
  }

  if (user === null) {
    return <div>Pas d'utilisateur connecté</div>;
  }

  const { data: chapters } = client.chapter.getAll.useQuery({
    queryKey: queryKeys.chapter.getAll({
      pathParams: { projectId: currentProject.id },
    }),
    queryData: {
      params: { projectId: currentProject.id },
    },
  });

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
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h2 className="text-2xl font-bold text-foreground">Export Avancé</h2>
          <p className="text-md">Exportez votre projet dans différents formats</p>
        </div>
      </div>

      <div className="flex justify-between space-x-4 space-y-4">
        <div className="w-2/3 bg-white h-fit rounded-lg border border-gray-200 p-4">
          <p className="font-bold text-lg p-2">Format d'export</p>

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
                      <FileIcon color={format.color} />
                    </div>

                    {selectedFormat && selectedFormat.id === format.id ? (
                      <div className="bg-blue-500 rounded-full flex items-center justify-center w-8 h-8">
                        <Check size={18} color="white" strokeWidth={3} />
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="font-semibold">{format.label}</p>
                    <p className="font-light text-gray-600">{format.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="w-1/3 bg-white h-fit rounded-lg border border-gray-200 p-4">
          <p className="font-bold text-lg pb-2">Aperçu de l'export</p>

          <div className="space-y-2 pb-3">
            <div className="flex justify-between">
              <p className="font-medium">Format:</p>
              <p>{selectedFormat ? selectedFormat.label : "Aucun format sélectionné"}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium">Chapitres:</p>
              <p>{chapters?.body.total}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium">Mots totaux:</p>
              <p>{currentProject.currentWordCount}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium">Pages estimées:</p>
              <p>{Math.ceil((currentProject.currentWordCount ?? 0) / 300)}</p>
            </div>
          </div>

          <Button
            variant="blue"
            className="w-full flex"
            disabled={!selectedFormat}
            onClick={handleExport}
          >
            <Download className="mr-2" />
            Exporter le projet
          </Button>
        </div>
      </div>

      <div className="w-2/3 bg-white h-fit rounded-lg border border-gray-200 p-4">
        <div className="flex items-center">
          <Settings />
          <p className="font-bold text-lg p-2">Options d'export</p>
        </div>

        <div className="pt-2">
          <p className="font-medium text-gray-600">Annexes</p>

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
                          <span>{params.label}</span>
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
