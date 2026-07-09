function deduplicateFiles(files: readonly File[]): File[] {
  return files.filter(
    (file, index, all) =>
      index ===
      all.findIndex(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified,
      ),
  );
}

export function getSelectedFiles(
  files: readonly File[],
  multiple: boolean,
  selectionMode: 'replace' | 'append',
  value: File | File[] | null,
): File | File[] | null {
  const selected = Array.from(files);

  if (!multiple) {
    return selected[0] ?? null;
  }

  if (selectionMode === 'replace') {
    return selected;
  }

  const current = Array.isArray(value) ? value : value ? [value] : [];

  return deduplicateFiles([...current, ...selected]);
}

export function filesToAcceptString(accept: string | string[] | null): string {
  if (Array.isArray(accept)) {
    return accept.join(',');
  }

  return accept ?? '';
}

export function formatFileName(
  value: File | File[] | null,
  translate: (key: string, params?: Record<string, unknown>) => string,
): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '';
    }
    return value.length === 1
      ? (value[0]?.name ?? '')
      : translate('fileSelector.filesSelected', {
          count: value.length,
        });
  }

  return value?.name ?? '';
}
