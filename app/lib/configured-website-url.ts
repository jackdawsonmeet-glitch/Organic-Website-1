/** Treat placeholder text and incomplete addresses as an unset destination. */
export function configuredWebsiteUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return;
    return url.href;
  } catch {
    return;
  }
}
