"use client";

import { useCallback } from "react";
import { FormControl, Select, MenuItem, ListItemText } from "@mui/material";

const PLACEHOLDER = "Insert {{...}}";

export const HandlebarsSnippetMenu = ({ options = [], onSelect }) => {
  const hasOptions = options.length > 0;

  const handleChange = useCallback(
    (event) => {
      const nextValue = typeof event.target.value === "string" ? event.target.value : "";

      if (!nextValue) {
        return;
      }

      const selected = options.find((item) => item.id === nextValue);

      if (selected) {
        onSelect?.(selected);
      }
    },
    [onSelect, options]
  );

  return (
    <FormControl size="small" sx={{ minWidth: 220 }} disabled={!hasOptions}>
      <Select
        displayEmpty
        value=""
        onChange={handleChange}
        renderValue={() => PLACEHOLDER}
      >
        <MenuItem value="" disabled>
          {PLACEHOLDER}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <ListItemText
              primary={option.label}
              secondary={option.detail ?? null}
              primaryTypographyProps={{
                sx: { fontFamily: "monospace", fontSize: "0.75rem" },
              }}
              secondaryTypographyProps={{
                sx: { color: "text.secondary", fontSize: "0.7rem" },
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
