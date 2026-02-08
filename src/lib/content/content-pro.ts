import path from "path";
import fs from "fs";
import { grayMatterContent } from "./gray-matter";
import { Content } from "@/types/content/content";
import { Slug } from "@/types/content/slug";
import calculateReadingTime from "reading-time";

const contentRootDirectory = path.join(process.cwd(), "src/content");
const contentMdxFileName = "content.mdx";

const parseContentPath = (
  routeParams: {name: string; positionInSlug: number}[],
  filePath: string,
): Record<string, string> => {
  const segments = filePath.split(path.sep).filter((s) => s.length > 0);
  const params: Record<string, string> = {};

  for (let i = 0; i < routeParams.length && i < segments.length; i++) {
    const param = routeParams[i]
    params[param.name] = segments[param.positionInSlug];
  }

  return params;
};

const findAllContent = (dynamicSlug: string) => {
  const results: {
    params: Record<string, string>;
    fullPath: string;
    relativePath: string;
  }[] = [];

  const segments = dynamicSlug.split(path.sep).filter((s) => s.length > 0);
  const directories: string[] = [segments[0]];
  const routeParams: {name: string; positionInSlug: number}[] = [];
  let currentSegmentPosition = 1;

  while (currentSegmentPosition < segments.length) {
    const currentSegment = segments[currentSegmentPosition];
    let currentLevelDimension = directories.length;

    if (currentSegment.match(/^\[([^\]]+)\]$/)) {
      while (currentLevelDimension > 0) {
        const currentDirectory = directories.shift()!;
        const entries = fs.readdirSync(
          path.join(contentRootDirectory, currentDirectory),
          { withFileTypes: true },
        );

        entries.forEach((entry) => {
          if (entry.isDirectory()) {
            directories.push(currentDirectory + "/" + entry.name);
          }
        });
        currentLevelDimension--;
      }
      routeParams.push({
        name: currentSegment.match(/^\[([^\]]+)\]$/)![1],
        positionInSlug: currentSegmentPosition,
      });
    } else {
      while (currentLevelDimension > 0) {
        const currentDirectory = directories.shift()!;
        directories.push(currentDirectory + "/" + currentSegment);
        currentLevelDimension--;
      }
    }

    currentSegmentPosition++;
  }

  directories.forEach((directory) => {
    const fullPath = path.join(
      contentRootDirectory,
      directory,
      contentMdxFileName,
    );
    const relativePath = path.relative(
      contentRootDirectory,
      path.dirname(fullPath),
    );
    const params = parseContentPath(routeParams, directory);

    results.push({
      params,
      fullPath,
      relativePath,
    });
  });

  return results;
};

const calculateSlugFrom = (
  params: Record<string, string>,
  dynamicSlug: string,
): string => {
    const slug = dynamicSlug.split("/").map((segment) => {
    const nextjsParameterPatternMatch = segment.match(/^\[([^\]]+)\]$/);

    if (nextjsParameterPatternMatch) {
      const paramName = nextjsParameterPatternMatch[1];
      const paramValue = params[paramName];
      return paramValue
    } else {
      return segment;
    }
  }).join("/");

  return slug;
}  

const generateSlugFrom = (
  params: Record<string, string>,
  dynamicSlug: string,
): Slug => {
  return {
    params,
    formatted: calculateSlugFrom(params, dynamicSlug),
  };
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

  console.log("contents", contents);
  // console.log("routeParams", routeParams);

  return contents.map((item) => {
    const { frontmatter, content } = grayMatterContent<TMeta>(
      item.fullPath,
      metadataAdapter,
    );

    // console.log("AAAA", routeParams, item.params, dynamicSlug)

    return {
      frontmatter,
      slug: generateSlugFrom(item.params, dynamicSlug),
      readingTime: calculateReadingTime(content),
      contentPath: item.relativePath,
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
    const filePath = path.join(contentRootDirectory, calculateSlugFrom(sanitizedParams, dynamicSlug), contentMdxFileName);
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
      slug: generateSlugFrom(sanitizedParams, dynamicSlug),
      readingTime: calculateReadingTime(content),
      contentPath: relativePath,
      content,
    };
  } catch {
    return undefined;
  }
};
