import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import type { ColorType } from "@papyrus/source";

import { Button } from "../../../../apps/desktop/src/components/ui/button";
import { ColorPicker } from "../../../../apps/desktop/src/components/ui/color-picker";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../../../../apps/desktop/src/components/ui/field";
import { Input } from "../../../../apps/desktop/src/components/ui/input";
import { Select, SelectValue } from "../../../../apps/desktop/src/components/ui/selects/select";
import { SelectContent } from "../../../../apps/desktop/src/components/ui/selects/select-content";
import { SelectItem } from "../../../../apps/desktop/src/components/ui/selects/select-item";
import { SelectTrigger } from "../../../../apps/desktop/src/components/ui/selects/select-trigger";
import { Tag } from "../../../../apps/desktop/src/components/ui/tag";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, string>) =>
      values?.tag ? `${key}:${values.tag}` : key,
  }),
}));

function ControlledTag() {
  const [tags, setTags] = useState<string[]>(["roman"]);

  return <Tag onChange={setTags} value={tags} />;
}

function ControlledColorPicker() {
  const [color, setColor] = useState<ColorType>("blue");

  return <ColorPicker onChange={setColor} value={color} />;
}

function ControlledSelect() {
  const [value, setValue] = useState("words");

  return (
    <Select onValueChange={setValue} value={value}>
      <SelectTrigger aria-label="Unite">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="words">Mots</SelectItem>
        <SelectItem value="hours">Heures</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("UI components", () => {
  it("renders a button and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Créer</Button>);

    await user.click(screen.getByRole("button", { name: "Créer" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an input and keeps typed value", async () => {
    const user = userEvent.setup();

    render(<Input aria-label="Titre" />);

    await user.type(screen.getByRole("textbox", { name: "Titre" }), "Mon projet");

    expect(screen.getByRole("textbox", { name: "Titre" })).toHaveValue("Mon projet");
  });

  it("adds and removes tags", async () => {
    const user = userEvent.setup();

    render(<ControlledTag />);

    expect(screen.getByText("roman")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("placeholder"), "fantasy");
    await user.click(screen.getByRole("button", { name: "common:add" }));

    expect(screen.getByText("fantasy")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "remove:roman" }));

    expect(screen.queryByText("roman")).not.toBeInTheDocument();
  });

  it("selects a color and exposes the selected state", async () => {
    const user = userEvent.setup();

    render(<ControlledColorPicker />);

    expect(screen.getByRole("button", { name: "colors.blue" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "colors.red" }));

    expect(screen.getByRole("button", { name: "colors.red" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("opens a select and changes its selected value", async () => {
    const user = userEvent.setup();

    render(<ControlledSelect />);

    await user.click(screen.getByRole("combobox", { name: "Unite" }));
    await user.click(await screen.findByRole("option", { name: "Heures" }));

    expect(screen.getByRole("combobox", { name: "Unite" })).toHaveTextContent("Heures");
  });

  it("renders grouped field content and separator labels", () => {
    render(
      <FieldSet>
        <FieldLegend variant="label">Informations</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <Input id="project-title" />
            <FieldContent>
              <FieldLabel htmlFor="project-title">Titre</FieldLabel>
              <FieldTitle>Nom affiché</FieldTitle>
              <FieldDescription>Visible dans la sidebar.</FieldDescription>
            </FieldContent>
          </Field>
          <FieldSeparator>Ou</FieldSeparator>
        </FieldGroup>
      </FieldSet>
    );

    const field = screen.getAllByRole("group").find((element) => element.dataset.slot === "field");

    expect(screen.getByText("Informations")).toHaveAttribute("data-variant", "label");
    expect(field).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByText("Titre")).toHaveAttribute("data-slot", "field-label");
    expect(screen.getByText("Nom affiché")).toHaveAttribute("data-slot", "field-label");
    expect(screen.getByText("Visible dans la sidebar.")).toHaveAttribute(
      "data-slot",
      "field-description"
    );
    expect(screen.getByText("Ou")).toHaveAttribute("data-slot", "field-separator-content");
  });

  it("renders unique field validation errors and custom children", () => {
    const errors = [
      { message: "Titre requis" },
      { message: "Titre requis" },
      { message: "Trop court" },
    ];

    const { rerender } = render(<FieldError errors={errors} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Titre requis");
    expect(screen.getByRole("alert")).toHaveTextContent("Trop court");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    rerender(<FieldError>Message personnalisé</FieldError>);

    expect(screen.getByRole("alert")).toHaveTextContent("Message personnalisé");
  });
});
