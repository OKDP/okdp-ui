/**
 * Represents a flattened JSON Schema property.
 */
export interface JsonSchemaProperty {
  type: string;
  name: string;
  defaultValue: any;
  isRequired: boolean;
  enum?: string[];
  pattern?: string;          // For strings
  minimum?: number;          // For numbers/integers
  maximum?: number;
  multipleOf?: number;
}

/**
 * Recursively extracts and flattens properties from a JSON Schema into a list of JsonSchemaProperty objects.
 *
 * @param schema - The JSON Schema object (must conform to Draft-07 or similar).
 * @param parentKey - Used internally for recursion to build dot-notation keys (e.g., "admin.user").
 * @param requiredFields - An array of property names at the current schema level that are required.
 * @returns An array of JsonSchemaProperty objects with flattened names, types, defaults, required flags, enums, and validation constraints.
 */
export function toJsonSchemaProperties(
  schema: unknown,
  parentKey = '',
  requiredFields: string[] = []
): JsonSchemaProperty[] {
  const result: JsonSchemaProperty[] = [];

  if (
    typeof schema !== 'object' ||
    schema === null ||
    !('properties' in schema) ||
    typeof (schema as any).properties !== 'object'
  ) {
    return result;
  }

  const properties = (schema as any).properties as Record<string, unknown>;

  for (const [key, value] of Object.entries(properties)) {
    if (typeof value !== 'object' || value === null) continue;

    const val = value as any;
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const isRequired = requiredFields.includes(key);

    // Nested object
    if (val.type === 'object' && val.properties) {
      const childRequired = Array.isArray(val.required) ? val.required : [];
      result.push(...toJsonSchemaProperties(val, fullKey, childRequired));
      continue;
    }

    // Array type
    if (val.type === 'array') {
      let itemType = 'unknown';
      let itemEnum: string[] | undefined;

      if (Array.isArray(val.items)) {
        itemType = val.items.map((item: any) => item?.type || 'unknown').join('|');
      } else if (typeof val.items === 'object' && val.items?.type) {
        itemType = val.items.type;
        if (Array.isArray(val.items.enum)) {
          itemEnum = val.items.enum;
        }
      }

      result.push({
        name: fullKey,
        type: `array<${itemType}>`,
        defaultValue: val.default,
        isRequired,
        enum: itemEnum,
      });
      continue;
    }

    // OneOf type
    if (Array.isArray(val.oneOf)) {
      const types = val.oneOf.map((sub: any) => sub?.type || 'unknown').join(' | ');
      result.push({
        name: fullKey,
        type: `oneOf(${types})`,
        defaultValue: val.default,
        isRequired,
      });
      continue;
    }

    // Const type
    if ('const' in val) {
      result.push({
        name: fullKey,
        type: 'const',
        defaultValue: val.const,
        isRequired,
      });
      continue;
    }

    // Enum type
    if (Array.isArray(val.enum)) {
      result.push({
        name: fullKey,
        type: val.type || 'string',
        defaultValue: val.default,
        isRequired,
        enum: val.enum,
      });
      continue;
    }

    // Basic types (string, number, boolean, etc.)
    const property: JsonSchemaProperty = {
      name: fullKey,
      type: val.type || 'unknown',
      defaultValue: val.default,
      isRequired,
    };

    // Add pattern if exists and type is string
    if (val.type === 'string' && typeof val.pattern === 'string') {
      property.pattern = val.pattern;
    }

    // Add number-specific constraints
    if (val.type === 'number' || val.type === 'integer') {
      if (typeof val.minimum === 'number') property.minimum = val.minimum;
      if (typeof val.maximum === 'number') property.maximum = val.maximum;
      if (typeof val.multipleOf === 'number') property.multipleOf = val.multipleOf;
    }

    result.push(property);
  }

  return sortRequiredFirst(result);
}

/**
 * Helper to sort properties putting required ones first.
 */
function sortRequiredFirst(props: JsonSchemaProperty[]): JsonSchemaProperty[] {
  return props.sort((a, b) => (a.isRequired === b.isRequired ? 0 : a.isRequired ? -1 : 1));
}
