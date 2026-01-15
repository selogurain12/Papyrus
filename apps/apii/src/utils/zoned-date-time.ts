import { parseAbsolute, ZonedDateTime } from "@internationalized/date";
import { Type, ValidationError, type EntityProperty } from "@mikro-orm/postgresql";

export class ZonedDateTimeType extends Type<
  ZonedDateTime | null | undefined,
  string | null | undefined
> {
  public override convertToDatabaseValue(
    value: ZonedDateTime | string | null | undefined
  ): string | null | undefined {
    if (value === null) {
      return null;
    }

    if (value === undefined) {
      return undefined;
    }

    if (value instanceof ZonedDateTime) {
      return value.toAbsoluteString();
    }

    if (typeof value === "string") {
      return parseAbsolute(value, "UTC").toAbsoluteString();
    }

    throw ValidationError.invalidType(ZonedDateTime, value, "JS");
  }

  public override convertToJSValue(
    value: ZonedDateTime | string | null | undefined
  ): ZonedDateTime | null | undefined {
    if (value === null) {
      return null;
    }

    if (value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      return parseAbsolute(value.replace(" ", "T"), "UTC");
    }

    if (value instanceof Date) {
      return parseAbsolute(value.toISOString(), "UTC");
    }

    throw ValidationError.invalidType(ZonedDateTime, value, "database");
  }

  public override getColumnType(property: EntityProperty) {
    return `timestamp(${property.precision ?? 6}) with time zone`;
  }

  /**
   * We convert ZonedDateTime to UTC string from the back, the client is in charge
   * to convert the date to its local time zone (with 'parseAbsoluteToLocal')
   */
  public override toJSON(value: ZonedDateTime | null | undefined): string | null | undefined {
    if (value === null) {
      return null;
    }

    if (value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      return value;
    }

    if (value instanceof ZonedDateTime) {
      return value.toAbsoluteString();
    }

    throw ValidationError.invalidType(ZonedDateTime, value, "json");
  }

  public override compareAsType(): string {
    return "date";
  }
}
