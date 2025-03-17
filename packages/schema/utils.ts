import * as v from "@valibot/valibot";

function schemaIsArray(
  schema: v.GenericSchema,
): schema is v.ArraySchema<v.GenericSchema, v.ErrorMessage<v.ArrayIssue>> {
  return schema.type === "array";
}

function schemaIsObject(
  schema: v.GenericSchema,
): schema is v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue>> {
  return schema.type === "object";
}

/** Validates a json pointer could be valid give a valibot schema */
export function getSubSchema(
  schema: v.GenericSchema,
  path: string[],
): v.GenericSchema {
  for (const part of path) {
    if (v.isOfType("any", schema) || v.isOfType("unknown", schema)) {
      return schema;
    } else if (schemaIsArray(schema)) {
      if (Number.isInteger(part)) {
        schema = schema.item;
      } else {
        return v.never();
      }
    } else if (v.isOfType("instance", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("intersect", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("lazy", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("looseObject", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("looseTuple", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("nonNullable", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("nonNullish", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("nonOptional", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("nullable", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("nullish", schema)) {
      throw new Error("Not implemented");
    } else if (schemaIsObject(schema)) {
      if (typeof part == "string") {
        schema = Reflect.get(schema.entries, part);
      } else {
        return v.never();
      }
    } else if (v.isOfType("objectWithRest", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("optional", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("map", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("record", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("set", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("strictObject", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("strictTuple", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("union", schema)) {
      throw new Error("Not implemented");
    } else if (v.isOfType("variant", schema)) {
      throw new Error("Not implemented");
    } else {
      return v.never();
    }
  }
  return schema;
}

export class BaseClass {
  returnAsMap(): Map<string, any> {
    const map = new Map();
    for (const [key, value] of Object.entries(this)) {
      if (
        ["string", "number", "boolean", "bigint"].includes(typeof value) ||
         value instanceof Uint8Array
      ) {
        map.set(key, value);
      } else if (value?.data) {
        map.set(key, value.data);
     }else if (value instanceof BaseClass) {
        map.set(key, value.returnAsMap());
      }  else {
        console.log("Unknown value type:", key, typeof value, value);
      }
    }
    return map;
  }
}
