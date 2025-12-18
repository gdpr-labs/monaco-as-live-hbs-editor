"use client";

import Handlebars from "handlebars/dist/handlebars";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TEMPLATE,
  MonacoEditorDemo,
} from "@/components/MonacoEditorDemo";

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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-slate-400">Playground</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Next.js + Monaco Editor
        </h1>
        <p className="max-w-2xl text-slate-300">
          Use the embedded Monaco editor below to experiment with Handlebars
          templates inside a modern Next.js App Router project.
        </p>
      </header>
      <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-300">
            <h2 className="text-lg font-semibold text-slate-100">
              Handlebars Template
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshTemplate}
                disabled={isTemplateLoading}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isTemplateLoading ? "Refreshing…" : "Refresh template"}
              </button>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-slate-400">
                Monaco Editor
              </span>
            </div>
          </div>
          {templateError ? (
            <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              {templateError}
            </p>
          ) : null}
          <MonacoEditorDemo
            height="240vh"
            value={template}
            onChange={handleTemplateChange}
          />
          <p className="text-right text-xs text-slate-500">{templateStatus}</p>
          <details className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
            <summary className="cursor-pointer text-slate-200">
              Sample context{" "}
              <span className="ml-2 text-xs text-slate-500">
                ({contextStatus})
              </span>
            </summary>
            {contextError ? (
              <p className="mt-2 text-xs text-amber-300">{contextError}</p>
            ) : null}
            <pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-md bg-slate-900/80 p-3 text-xs text-slate-400">
              {formattedContext || "No data loaded."}
            </pre>
          </details>
        </div>
        <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-300">
            <h2 className="text-lg font-semibold text-slate-100">
              Rendered Preview
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshContext}
                disabled={isContextLoading}
                className="rounded-full border border-emerald-600/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300 transition hover:border-emerald-400/60 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isContextLoading ? "Refreshing…" : "Refresh context"}
              </button>
              <span className="rounded-full border border-emerald-700/60 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-wide text-emerald-300">
                Live Output
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-auto rounded-lg border border-slate-800 bg-slate-950/60 p-6">
            {isContextLoading ? (
              <p className="text-sm text-slate-400">Loading sample data…</p>
            ) : contextError ? (
              <pre className="whitespace-pre-wrap rounded-md border border-amber-500/40 bg-amber-950/40 p-4 text-sm text-amber-200">
                {contextError}
              </pre>
            ) : !context ? (
              <p className="text-sm text-slate-400">
                No sample data available. Add content to public/sampleData.hbs
                to see the preview.
              </p>
            ) : compiled?.error ? (
              <pre className="whitespace-pre-wrap rounded-md border border-rose-600/40 bg-rose-950/50 p-4 text-sm text-rose-200">
                {compiled.error}
              </pre>
            ) : (
              <div
                className="preview-output"
                dangerouslySetInnerHTML={{ __html: compiled?.html ?? "" }}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
