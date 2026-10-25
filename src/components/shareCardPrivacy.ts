export const DEFAULT_INCLUDE_MESSAGE = false;

export function getShareCardMessage(
  message: string,
  includeMessage: boolean
): string | null {
  return includeMessage ? message : null;
}
