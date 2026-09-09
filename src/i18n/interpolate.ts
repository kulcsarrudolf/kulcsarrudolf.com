import { type ReactNode, cloneElement, isValidElement } from "react";

export type TranslationParams = Record<string, string | ReactNode>;

// Fills the placeholders of a translated string. `{name}` is replaced by the
// matching param; `{tag/}...{/tag}` is replaced by the matching param as a whole,
// which lets a translation carry a link or another element without the copy
// knowing what it is. React elements are given a key so the result can be
// rendered as children. A string that needs no elements comes back as a plain
// string.
export function interpolate(value: string, params: TranslationParams): string | ReactNode[] {
  const result: (string | ReactNode)[] = [];
  let i = 0;
  let elementIndex = 0;

  while (i < value.length) {
    const openTag = value.indexOf("{", i);
    if (openTag === -1) {
      const remaining = value.substring(i);
      if (remaining) result.push(remaining);
      break;
    }

    if (openTag > i) {
      result.push(value.substring(i, openTag));
    }

    const closeTag = value.indexOf("}", openTag);
    if (closeTag === -1) {
      result.push(value.substring(openTag));
      break;
    }

    const placeholder = value.substring(openTag + 1, closeTag);

    if (placeholder.startsWith("/")) {
      // Closing tag, skip
      i = closeTag + 1;
      continue;
    }

    // Check if it's a tag like {highlight}...{/highlight}
    const tagMatch = placeholder.match(/^(\w+)\//);
    if (tagMatch) {
      const tagName = tagMatch[1];
      const closingTagPattern = `{/${tagName}}`;
      const closingTagIndex = value.indexOf(closingTagPattern, closeTag);

      if (closingTagIndex !== -1) {
        const content = value.substring(closeTag + 1, closingTagIndex);
        const paramValue = params?.[tagName];

        if (paramValue !== undefined) {
          // Add key to React elements
          const elementWithKey = isValidElement(paramValue)
            ? cloneElement(paramValue, {
                key: `translation-${elementIndex++}`,
              })
            : paramValue;
          result.push(elementWithKey);
        } else {
          result.push(content);
        }

        i = closingTagIndex + closingTagPattern.length;
      } else {
        i = closeTag + 1;
      }
    } else {
      // Simple placeholder
      const paramValue = params[placeholder];
      if (paramValue !== undefined) {
        // Add key to React elements
        const elementWithKey = isValidElement(paramValue)
          ? cloneElement(paramValue, {
              key: `translation-${elementIndex++}`,
            })
          : paramValue;
        result.push(elementWithKey);
      } else {
        result.push(`{${placeholder}}`);
      }
      i = closeTag + 1;
    }
  }

  // Add keys to string elements in arrays that will be rendered as children
  if (result.length > 1) {
    return result.map((item, idx) => {
      if (typeof item === "string") {
        return item;
      }
      if (isValidElement(item) && !item.key) {
        return cloneElement(item, { key: `translation-${idx}` });
      }
      return item;
    });
  }

  return result.length === 1 && typeof result[0] === "string" ? result[0] : result;
}
