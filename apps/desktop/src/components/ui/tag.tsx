import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

interface TagProps {
  value?: string[] | null;
  // eslint-disable-next-line no-unused-vars
  onChange: (tags: string[]) => void;
  className?: string;
  disabled?: boolean;
  maxTags?: number;
  placeholder?: string;
  id?: string;
}

// eslint-disable-next-line complexity
export function Tag({
  value,
  onChange,
  className,
  disabled = false,
  maxTags = undefined,
  placeholder = undefined,
  id = undefined,
}: TagProps) {
  const { t } = useTranslation(["ui/tag", "common"]);
  const generatedId = useId();
  const [tagInput, setTagInput] = useState("");
  const tags = value ?? [];
  const canAddTag = maxTags === undefined || tags.length < maxTags;

  function handleAddTag() {
    const nextTag = tagInput.trim();

    if (!nextTag || !canAddTag || tags.includes(nextTag)) {
      return;
    }

    onChange([...tags, nextTag]);
    setTagInput("");
  }

  function handleRemoveTag(index: number) {
    onChange(tags.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Input
          id={id ?? generatedId}
          value={tagInput}
          disabled={disabled || !canAddTag}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAddTag();
            }
          }}
          placeholder={placeholder ?? t("placeholder")}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || !canAddTag || !tagInput.trim()}
          onClick={handleAddTag}
          className="h-10.5"
        >
          {t("common:add")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={
              "flex items-center gap-1 rounded-full border border-slate-300 " +
              "bg-slate-100 px-2 py-1 text-xs"
            }
          >
            {tag}
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleRemoveTag(index)}
              className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-slate-200"
              aria-label={t("remove", { tag })}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
