import path from "path";
import fs from "fs";
import { grayMatterContent } from "./gray-matter";
import { Content } from "@/types/content/content";
import calculateReadingTime from "reading-time";

const contentRootDirectory = path.join(process.cwd(), "src/content");
const contentMdxFileName = "content.mdx";

const getSegmentsFromDynamicSlug = (slug: string): string[] =>
  slug.split('/').filter((segment) => segment.length > 0);

const dynamicRouteParamFrom = (segment: string) =>
  segment.match(/^\[([^\]]+)\]$/)?.[1];

const extractParametersValueFrom = (
  filePath: string,
  routeParams: { name: string; positionInSlug: number }[],
): Record<string, string> => {
  const segments = filePath.split(path.sep).filter((s) => s.length > 0);
  const params: Record<string, string> = {};

  for (const routeParam of routeParams) {
    params[routeParam.name] = segments[routeParam.positionInSlug];
  }

  return params;
};

const getAllFoldersContainedIn = (directory: string) => {
  const directories: string[] = [];
  const entries = fs.readdirSync(path.join(contentRootDirectory, directory), {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push(path.join(directory, entry.name));
    }
  }
  
  return directories;
};

const findAllContent = (dynamicSlug: string) => {
  const segments = getSegmentsFromDynamicSlug(dynamicSlug);
  const directoriesQueue: string[] = [segments[0]];
  const detectedDynamicRouteParams: { name: string; positionInSlug: number }[] =
    [];
  let currentSegmentPosition = 1;

  while (currentSegmentPosition < segments.length) {
    let currentLevelDimension = directoriesQueue.length;
    const currentSegment = segments[currentSegmentPosition];
    const dynamicRouteParam = dynamicRouteParamFrom(currentSegment);

    if (dynamicRouteParam) {
      while (currentLevelDimension > 0) {
        const currentDirectory = directoriesQueue.shift()!;
        const folders = getAllFoldersContainedIn(currentDirectory);
        directoriesQueue.push(...folders);
        currentLevelDimension--;
      }
      detectedDynamicRouteParams.push({
        name: dynamicRouteParam,
        positionInSlug: currentSegmentPosition,
      });
    } else {
      while (currentLevelDimension > 0) {
        const currentDirectory = directoriesQueue.shift()!;
        directoriesQueue.push(path.join(currentDirectory, currentSegment));
        currentLevelDimension--;
      }
    }

    currentSegmentPosition++;
  }

  const results = [];

  for (const directory of directoriesQueue) {
    const relativePath = path.join(directory, contentMdxFileName);

    results.push({
      fullPath: path.join(contentRootDirectory, relativePath),
      relativePath,
      params: extractParametersValueFrom(directory, detectedDynamicRouteParams),
    });
  }

  return results;
};

const calculateSlugFrom = (
  params: Record<string, string>,
  dynamicSlug: string,
): string => {
  const slug = getSegmentsFromDynamicSlug(dynamicSlug)
    .map((segment) => {
      const dynamicRouteParam = dynamicRouteParamFrom(segment);

      if (dynamicRouteParam) {
        return params[dynamicRouteParam];
      } else {
        return segment;
      }
    })
    .join("/");

  return `/${slug}`;
};

export const getAllContentForPro = <TMeta>(
  dynamicSlug: string,
  metadataAdapter?: (raw: unknown) => TMeta,
): Content<TMeta>[] => {
  const contents: {
    params: Record<string, string>;
    fullPath: string;
    relativePath: string;
  }[] = findAllContent(dynamicSlug);

  return contents.map((item) => {
    const { frontmatter, content } = grayMatterContent<TMeta>(
      item.fullPath,
      metadataAdapter,
    );

    return {
      frontmatter,
      slug: {
        params: item.params,
        formatted: calculateSlugFrom(item.params, dynamicSlug),
      },
      readingTime: calculateReadingTime(content),
      contentFileRelativePath: item.relativePath,
      content,
    };
  });
};

export const getSingleContentProBy = <TMeta>(
  dynamicSlug: string,
  params?: Record<string, string>,
  metadataAdapter?: (raw: unknown) => TMeta,
): Content<TMeta> | undefined => {
  const sanitizedParams = params || {};
  try {
    const slug = calculateSlugFrom(sanitizedParams, dynamicSlug);
    const filePath = path.join(contentRootDirectory, slug, contentMdxFileName);
    const { frontmatter, content } = grayMatterContent<TMeta>(
      filePath,
      metadataAdapter,
    );
    const relativePath = path.relative(
      contentRootDirectory,
      path.dirname(filePath),
    );

    return {
      frontmatter,
      slug: {
        params: sanitizedParams,
        formatted: slug,
      },
      readingTime: calculateReadingTime(content),
      contentFileRelativePath: relativePath,
      content,
    };
  } catch {
    return undefined;
  }
};
