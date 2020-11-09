export function getCoveragePath(dir: string, filePath: string): string[]{
  return [`--collectCoverageFrom="${dir}"`, filePath, dir]
}
