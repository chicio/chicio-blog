import path from "path";
import fs from "fs";
import { grayMatterContent } from "./gray-matter";
import { Content } from "@/types/content/content";
import { Slug } from "@/types/content/slug";
import calculateReadingTime from "reading-time";

const contentRootDirectory = path.join(process.cwd(), "src/content");
const contentMdxFileName = "content.mdx";

const detectRouteParams = (routePath: string): string[] => {
  const params: string[] = [];
  let currentPath = routePath;

  while (fs.existsSync(currentPath)) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    if (entries.some((e) => e.isFile() && e.name === "page.tsx")) {
      break;
    }

    const nextDir = entries.find((e) => e.isDirectory());
    
    if (!nextDir) {
      break;
    }

    const nextjsParameterPatternMatch = nextDir.name.match(/^\[([^\]]+)\]$/);

    if (nextjsParameterPatternMatch) {
      params.push(nextjsParameterPatternMatch[1]);
    }

    currentPath = path.join(currentPath, nextDir.name);
  }

  return params;
};

const parseContentPath = (
  routeParams: string[],
  filePath: string,
): Record<string, string> => {
  const segments = filePath.split(path.sep).filter((s) => s.length > 0);
  const params: Record<string, string> = {};

  for (let i = 0; i < routeParams.length && i < segments.length; i++) {
    params[routeParams[i]] = segments[i];
  }

  return params;
};

const findAllContent = (contentDir: string, routeParams: string[]) => {
  const specificContentDir = path.join(contentRootDirectory, contentDir);
  const results: {
    params: Record<string, string>;
    fullPath: string;
    relativePath: string;
  }[] = [];

  const scanDirectory = (currentPath: string) => {
    if (!fs.existsSync(currentPath)) {
      console.log(`Directory does not exist: ${currentPath}`);
      return;
    }

    const entries = fs.readdirSync(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name === contentMdxFileName) {
        const relativePath = path.relative(
          contentRootDirectory,
          path.dirname(fullPath),
        );
        const pathForParams = path.relative(
          specificContentDir,
          path.dirname(fullPath),
        );
        const params = parseContentPath(routeParams, pathForParams);

        results.push({
          params,
          fullPath,
          relativePath,
        });
      }
    }
  };

  scanDirectory(specificContentDir);

  return results;
};

const getContentFilePathFrom = (
  contentDir: string,
  routeParams: string[],
  params: Record<string, string>,
): string => {
  const specificContentDir = path.join(contentRootDirectory, contentDir);
  const pathSegments = routeParams.map((param) => params[param]);

  return path.join(specificContentDir, ...pathSegments, contentMdxFileName);
};

const generateSlugFrom = (
  params: Record<string, string>,
  urlBase: string,
  routeParams: string[],
): Slug => {
  const pathSegments = routeParams
    .map((routeParam) => params[routeParam])
    .join("/");

  return {
    params,
    formatted: `${urlBase}/${pathSegments}`,
  };
};

export const getAllContentFor = <TMeta>(
  baseUrl: string,
  metadataAdapter?: (raw: unknown) => TMeta,
): Content<TMeta>[] => {
  const basePath = baseUrl.startsWith("/") ? baseUrl.slice(1) : baseUrl;
  const routeParams = detectRouteParams(
    path.join(process.cwd(), `src/app/${basePath}`),
  );
  const contents = findAllContent(basePath, routeParams);

  return contents.map((item) => {
    const { frontmatter, content } = grayMatterContent<TMeta>(item.fullPath, metadataAdapter);

    return {
      frontmatter,
      slug: generateSlugFrom(item.params, baseUrl, routeParams),
      readingTime: calculateReadingTime(content),
      contentPath: item.relativePath,
      content,
    };
  });
};

export const getSingleContentBy = <TMeta>(
  baseUrl: string,
  params?: Record<string, string>,
  metadataAdapter?: (raw: unknown) => TMeta,
): Content<TMeta> | undefined => {
  const sanitizedParams = params || {};
  try {
    const basePath = baseUrl.startsWith("/") ? baseUrl.slice(1) : baseUrl;
    const routeParams = detectRouteParams(
      path.join(process.cwd(), `src/app/${basePath}`),
    );
    const filePath = getContentFilePathFrom(basePath, routeParams, sanitizedParams);
    const { frontmatter, content } = grayMatterContent<TMeta>(filePath, metadataAdapter);

    const relativePath = path.relative(
      contentRootDirectory,
      path.dirname(filePath),
    );

    return {
      frontmatter,
      slug: generateSlugFrom(sanitizedParams, baseUrl, routeParams),
      readingTime: calculateReadingTime(content),
      contentFileRelativePath: relativePath,
      content,
    };
  } catch {
    return undefined;
  }
};
