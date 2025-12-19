"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import Handlebars from "handlebars/dist/handlebars";

import {
  DEFAULT_TEMPLATE,
  MonacoEditorDemo,
} from "@/components/MonacoEditorDemo";
import { COMMON_SNIPPETS } from "@/components/snippets";
import { HandlebarsSnippetMenu } from "@/components/HandlebarsSnippetMenu";

const buildContextSnippets = (data) => {
  if (!data || typeof data !== "object") {
    return [];
  }

  const snippets = [];
  const seen = new Set();

  const visit = (node, path) => {
    if (node === null || node === undefined) {
      return;
    }

    if (Array.isArray(node)) {
      if (!path.length) {
        return;
      }

      const joinedPath = path.join(".");
      const firstObject = node.find(
        (item) => item && typeof item === "object" && !Array.isArray(item)
      );
      const sampleKeys = firstObject
        ? Object.keys(firstObject).slice(0, 2)
        : [];
      const loopBody = sampleKeys.length
        ? sampleKeys.map((key) => `  {{${key}}}`).join("\n")
        : "  {{this}}";

      const loopOption = {
        id: `each:${joinedPath}`,
        label: `{{#each ${joinedPath}}}`,
        snippet: `{{#each ${joinedPath}}}\n${loopBody}\n{{/each}}`,
        detail: "Loop over context array",
      };

      if (!seen.has(loopOption.id)) {
        snippets.push(loopOption);
        seen.add(loopOption.id);
      }

      return;
    }

    if (typeof node === "object") {
      Object.entries(node).forEach(([key, value]) => {
        visit(value, [...path, key]);
      });
      return;
    }

    if (!path.length) {
      return;
    }

    const joinedPath = path.join(".");
    const valueOption = {
      id: `value:${joinedPath}`,
      label: `{{${joinedPath}}}`,
      snippet: `{{${joinedPath}}}`,
      detail: "Context value",
    };

    if (!seen.has(valueOption.id)) {
      snippets.push(valueOption);
      seen.add(valueOption.id);
    }
  };

  visit(data, []);
  return snippets.sort((a, b) => a.label.localeCompare(b.label));
};

const HomePage = () => {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [templateError, setTemplateError] = useState(null);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [contextError, setContextError] = useState(null);
  const [isContextLoading, setIsContextLoading] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const refreshTemplate = useCallback(async () => {
    setIsTemplateLoading(true);
    setTemplateError(null);

    try {
      const response = await fetch(`/sampleData.hbs?ts=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load sampleData.hbs: ${response.status}`);
      }

      const fileContents = await response.text();
      setTemplate(fileContents);
    } catch (error) {
      setTemplateError(
        error instanceof Error ? error.message : "Unknown template load error"
      );
    } finally {
      setIsTemplateLoading(false);
    }
  }, []);

  const refreshContext = useCallback(async () => {
    setIsContextLoading(true);
    setContextError(null);

    try {
      const response = await fetch(`/sampleContext.json?ts=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load sampleContext.json: ${response.status}`
        );
      }

      const parsed = await response.json();
      setContext(parsed);
    } catch (error) {
      setContext(null);
      setContextError(
        error instanceof Error ? error.message : "Unknown data load error"
      );
    } finally {
      setIsContextLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTemplate();
    refreshContext();
  }, [refreshContext, refreshTemplate]);

  const mustacheOptions = useMemo(() => {
    const contextual = context ? buildContextSnippets(context) : [];
    const merged = [...COMMON_SNIPPETS, ...contextual];
    const seen = new Set();

    return merged.filter((option) => {
      if (seen.has(option.id)) {
        return false;
      }

      seen.add(option.id);
      return true;
    });
  }, [context]);

  const compiled = useMemo(() => {
    if (!context) {
      return null;
    }

    try {
      const render = Handlebars.compile(template);
      return {
        html: render(context),
        error: null,
      };
    } catch (err) {
      return {
        html: "",
        error: err instanceof Error ? err.message : "Unknown Handlebars error",
      };
    }
  }, [context, template]);

  const handleTemplateChange = useCallback((nextValue) => {
    setTemplate(nextValue);
  }, []);

  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  const handleSnippetInsert = useCallback((snippet) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco || !snippet) {
      return;
    }

    const selection = editor.getSelection();

    if (!selection || !editor.getModel()) {
      return;
    }

    const { startLineNumber, startColumn, endLineNumber, endColumn } =
      selection;
    const range = new monaco.Range(
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn
    );

    editor.executeEdits("mustache-menu", [
      {
        range,
        text: snippet,
        forceMoveMarkers: true,
      },
    ]);

    const lines = snippet.split("\n");
    const lastLine = lines[lines.length - 1] ?? "";
    const lineNumber = startLineNumber + lines.length - 1;
    const column =
      lines.length === 1 ? startColumn + lastLine.length : lastLine.length + 1;

    editor.setPosition({ lineNumber, column });
    editor.focus();
  }, []);

  const handleSnippetSelect = useCallback(
    (option) => {
      if (!option || !option.snippet) {
        return;
      }

      handleSnippetInsert(option.snippet);
    },
    [handleSnippetInsert]
  );

  const formattedContext = useMemo(
    () => (context ? JSON.stringify(context, null, 2) : ""),
    [context]
  );

  const templateStatus = useMemo(() => {
    if (isTemplateLoading) {
      return "Loading sampleData.hbs…";
    }

    if (templateError) {
      return "Load failed";
    }

    return "Loaded from sampleData.hbs";
  }, [isTemplateLoading, templateError]);

  const contextStatus = useMemo(() => {
    if (isContextLoading) {
      return "Loading sampleContext.json…";
    }

    if (contextError) {
      return "Load failed";
    }

    if (context) {
      return "Loaded from sampleContext.json";
    }

    return "No data available";
  }, [context, contextError, isContextLoading]);

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        py: 6,
      }}
    >
      <Box
        component="header"
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Typography variant="overline" color="info.main">
          Playground
        </Typography>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontSize: { xs: "1.875rem", sm: "2.25rem" } }}
        >
          Next.js + Monaco Editor
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: "42rem" }}
          color="text.secondary"
        >
          Use the embedded Monaco editor below to experiment with Handlebars
          templates inside a modern Next.js App Router project.
        </Typography>
      </Box>
      <Box
        component="section"
        sx={{
          display: "grid",
          flex: 1,
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="h2">
              Handlebars Template
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={refreshTemplate}
                disabled={isTemplateLoading}
                sx={{ fontSize: "0.75rem", px: 1.5 }}
              >
                {isTemplateLoading ? "Refreshing…" : "Refresh template"}
              </Button>
              <HandlebarsSnippetMenu
                options={mustacheOptions}
                onSelect={handleSnippetSelect}
              />
            </Box>
          </Box>
          {templateError ? (
            <Alert severity="warning" sx={{ fontSize: "0.75rem" }}>
              {templateError}
            </Alert>
          ) : null}
          <MonacoEditorDemo
            height="240vh"
            value={template}
            onChange={handleTemplateChange}
            onEditorMount={handleEditorMount}
          />
          <Typography
            variant="caption"
            sx={{ textAlign: "right" }}
            color="text.disabled"
          >
            {templateStatus}
          </Typography>
          <Paper
            component="details"
            variant="outlined"
            open
            sx={{
              p: 2,
              bgcolor: "background.default",
              "& summary": {
                cursor: "pointer",
                userSelect: "none",
                "&:hover": {
                  color: "primary.main",
                },
              },
            }}
          >
            <summary>
              Sample context{" "}
              <Typography
                component="span"
                variant="caption"
                sx={{ ml: 1 }}
                color="text.disabled"
              >
                ({contextStatus})
              </Typography>
            </summary>
            {contextError ? (
              <Typography
                variant="caption"
                sx={{ mt: 1, display: "block" }}
                color="warning.main"
              >
                {contextError}
              </Typography>
            ) : null}
            <Box
              component="pre"
              sx={{
                mt: 1.5,
                maxHeight: "32rem",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                borderRadius: 1,
                bgcolor: "background.paper",
                p: 1.5,
                fontSize: "0.75rem",
                color: "text.secondary",
              }}
            >
              {formattedContext || "No data loaded."}
            </Box>
          </Paper>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="h2">
              Rendered Preview
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                color="success"
                onClick={refreshContext}
                disabled={isContextLoading}
                sx={{ fontSize: "0.75rem", px: 1.5 }}
              >
                {isContextLoading ? "Refreshing…" : "Refresh context"}
              </Button>
            </Box>
          </Box>

          {isContextLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading sample data…
            </Typography>
          ) : contextError ? (
            <Alert severity="warning" sx={{ fontSize: "0.875rem" }}>
              {contextError}
            </Alert>
          ) : !context ? (
            <Typography variant="body2" color="text.secondary">
              No sample data available. Add content to public/sampleData.hbs to
              see the preview.
            </Typography>
          ) : compiled?.error ? (
            <Alert severity="error" sx={{ fontSize: "0.875rem" }}>
              <Box
                component="pre"
                sx={{ whiteSpace: "pre-wrap", m: 0, fontFamily: "monospace" }}
              >
                {compiled.error}
              </Box>
            </Alert>
          ) : (
            <Box
              className="preview-output"
              dangerouslySetInnerHTML={{ __html: compiled?.html ?? "" }}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
