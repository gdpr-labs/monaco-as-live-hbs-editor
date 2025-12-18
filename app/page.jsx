"use client";

import Handlebars from "handlebars/dist/handlebars";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TEMPLATE,
  MonacoEditorDemo,
} from "@/components/MonacoEditorDemo";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Alert
} from '@mui/material';

const HomePage = () => {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [templateError, setTemplateError] = useState(null);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [contextError, setContextError] = useState(null);
  const [isContextLoading, setIsContextLoading] = useState(false);

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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        py: 6
      }}
    >
      <Box component="header" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="overline" color="info.main">
          Playground
        </Typography>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem' } }}
        >
          Next.js + Monaco Editor
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '42rem' }} color="text.secondary">
          Use the embedded Monaco editor below to experiment with Handlebars
          templates inside a modern Next.js App Router project.
        </Typography>
      </Box>
      <Box
        component="section"
        sx={{
          display: 'grid',
          flex: 1,
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h2">
              Handlebars Template
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={refreshTemplate}
                disabled={isTemplateLoading}
                sx={{ fontSize: '0.75rem', px: 1.5 }}
              >
                {isTemplateLoading ? "Refreshing…" : "Refresh template"}
              </Button>
              <Chip
                label="Monaco Editor"
                size="small"
                variant="outlined"
                color="info"
                sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}
              />
            </Box>
          </Box>
          {templateError ? (
            <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
              {templateError}
            </Alert>
          ) : null}
          <MonacoEditorDemo
            height="240vh"
            value={template}
            onChange={handleTemplateChange}
          />
          <Typography variant="caption" sx={{ textAlign: 'right' }} color="text.disabled">
            {templateStatus}
          </Typography>
          <Paper
            component="details"
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'background.default',
              '& summary': {
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': {
                  color: 'primary.main'
                }
              }
            }}
          >
            <summary>
              Sample context{" "}
              <Typography component="span" variant="caption" sx={{ ml: 1 }} color="text.disabled">
                ({contextStatus})
              </Typography>
            </summary>
            {contextError ? (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }} color="warning.main">
                {contextError}
              </Typography>
            ) : null}
            <Box
              component="pre"
              sx={{
                mt: 1.5,
                maxHeight: '32rem',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                borderRadius: 1,
                bgcolor: 'background.paper',
                p: 1.5,
                fontSize: '0.75rem',
                color: 'text.secondary'
              }}
            >
              {formattedContext || "No data loaded."}
            </Box>
          </Paper>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h2">
              Rendered Preview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                color="success"
                onClick={refreshContext}
                disabled={isContextLoading}
                sx={{ fontSize: '0.75rem', px: 1.5 }}
              >
                {isContextLoading ? "Refreshing…" : "Refresh context"}
              </Button>
              <Chip
                label="Live Output"
                size="small"
                variant="outlined"
                color="success"
                sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}
              />
            </Box>
          </Box>
          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              width: '100%',
              overflow: 'auto',
              p: 3,
              bgcolor: '#ffffff'
            }}
          >
            {isContextLoading ? (
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Loading sample data…
              </Typography>
            ) : contextError ? (
              <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                {contextError}
              </Alert>
            ) : !context ? (
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                No sample data available. Add content to public/sampleData.hbs
                to see the preview.
              </Typography>
            ) : compiled?.error ? (
              <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0, fontFamily: 'monospace' }}>
                  {compiled.error}
                </Box>
              </Alert>
            ) : (
              <Box
                className="preview-output"
                sx={{ color: '#1e293b' }}
                dangerouslySetInnerHTML={{ __html: compiled?.html ?? "" }}
              />
            )}
          </Paper>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
