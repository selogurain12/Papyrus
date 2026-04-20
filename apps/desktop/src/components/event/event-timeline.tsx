/* eslint-disable no-unused-vars */
import { parseZonedDateTime } from "@internationalized/date";
import { EventDto, queryKeys } from "@papyrus/source";
import {
  AlertCircle,
  AlertTriangle,
  Bolt,
  Calendar,
  Circle,
  Edit3,
  FileTextIcon,
  MapPin,
  Trash2,
} from "lucide-react";
import { useFilterDto } from "../../utils/filters/use-filter-dto";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Timeline } from "../ui/timeline/timeline";
import { TimelineContent } from "../ui/timeline/timeline-content";
import { TimelineDot } from "../ui/timeline/timeline-dot";
import { TimelineItem } from "../ui/timeline/timeline-item";
import { format } from "../../utils/date/date-utils";

function getStatusIcon(status: "critical" | "important" | "action" | "normal" | null) {
  switch (status) {
    case "critical": {
      return {
        icon: <AlertTriangle className="size-5 md:size-zoom-5 text-red-800" />,
        color: "bg-red-200 text-red-800",
      };
    }
    case "important": {
      return {
        icon: <AlertCircle className="size-5 md:size-zoom-5 text-orange-800" />,
        color: "bg-orange-200 text-orange-800",
      };
    }
    case "action": {
      return {
        icon: <Bolt className="size-5 md:size-zoom-5 text-blue-800" />,
        color: "bg-blue-200 text-blue-800",
      };
    }
    case "normal": {
      return {
        icon: <Circle className="size-5 md:size-zoom-5 text-green-800" />,
        color: "bg-green-200 text-green-800",
      };
    }
    default: {
      return {
        icon: <FileTextIcon className="size-5 md:size-zoom-5 text-gray-800" />,
        color: "bg-gray-200 text-gray-800",
      };
    }
  }
}

export function EventTimeline({
  setSelectedEvent,
  setUpdating,
  setDeleting,
}: {
  setSelectedEvent: (event: EventDto | undefined) => void;
  setUpdating: (isUpdating: boolean) => void;
  setDeleting: (isDeleting: boolean) => void;
}) {
  const { currentProject } = useProject();
  const { options } = useFilterDto({
    itemsPerPage: 20,

    orderBy: {
      eventDate: "desc",
    },

    page: 1,
  });
  const eventTimeline = client.event.getAll.useQuery({
    queryKey: queryKeys.event.getAll({
      query: { ...options },
    }),
    queryData: {
      query: options,
      params: { projectId: currentProject?.id ?? "" },
    },
  });

  function content(currentEvent: EventDto) {
    return (
      <div className="relative flex flex-row pt-1 md:pt-zoom-1 justify-between">
        <div className="flex flex-col gap-2 md:gap-zoom-2">
          <p className="text-sm md:text-zoom-sm font-medium">{currentEvent.title}</p>
          <p className="text-xs md:text-zoom-xs text-gray-500">{currentEvent.description}</p>
          <p className="flex text-xs md:text-zoom-xs text-gray-500">
            <MapPin className="size-4" /> {currentEvent.location}
          </p>
        </div>

        <div className="flex flex-col gap-2 md:gap-zoom-2 items-end">
          <p className="flex text-xs md:text-zoom-xs text-gray-500">
            <Calendar className="size-4" />{" "}
            {format(parseZonedDateTime(currentEvent.eventDate), "dd MMMM yyyy")}
          </p>
        </div>
        <div
          className="
          absolute bottom-2 right-2
          opacity-0 group-hover:opacity-100
          transition-opacity flex gap-2
        "
        >
          <button
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            onClick={() => setUpdating(true)}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            onClick={() => setDeleting(true)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card className="flex justify-between items-center bg-white h-fit">
      <div className="flex flex-col flex-auto">
        <CardHeader className="flex flex-col pb-0 items-center md:items-start">
          <p className="font-bold mb-3">Ligne temporelle</p>
        </CardHeader>
        <CardContent className="items-center md:items-start">
          <ScrollArea className="grow h-fit">
            <Timeline>
              {eventTimeline.data?.body.data.map((event, index, array) => {
                const isLast = index === array.length - 1;
                return (
                  <TimelineItem className="p-1" key={event.eventDate}>
                    <TimelineDot className={getStatusIcon(event.importance).color} isLast={isLast}>
                      {getStatusIcon(event.importance).icon}
                    </TimelineDot>

                    <TimelineContent className="w-full">
                      <button
                        className={`
                              w-full text-left px-4 py-2 rounded-md border border-gray-300
                              transition duration-150
                              ${
                                index === 0
                                  ? // eslint-disable-next-line max-len
                                    "bg-blue-100 border-blue-400 shadow font-bold ring-2 ring-blue-200"
                                  : "bg-white/80"
                              }
                              hover:bg-blue-50 hover:border-blue-400 hover:shadow
                              focus:outline-none focus:ring-2 focus:ring-blue-200
                              group
                            `}
                        onClick={() => {
                          setSelectedEvent(event);
                        }}
                        type="button"
                      >
                        {content(event)}
                      </button>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </ScrollArea>
        </CardContent>
      </div>
    </Card>
  );
}
