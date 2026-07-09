import {
  filesToAcceptString,
  formatFileName,
  getSelectedFiles,
} from './file-selector.utils';

describe('file-selector.utils', () => {
  function createFile(
    name: string,
    type = 'text/plain',
    contents = 'test',
    lastModified = 12345,
  ): File {
    return new File([contents], name, {
      type,
      lastModified,
    });
  }

  describe('getSelectedFiles', () => {
    it('returns a single File when multiple is false', () => {
      const file1 = createFile('one.txt');
      const file2 = createFile('two.txt');

      const result = getSelectedFiles([file1, file2], false, 'replace', null);

      expect(result).toBe(file1);
    });

    it('returns null when multiple is false and no files are selected', () => {
      const result = getSelectedFiles([], false, 'replace', null);

      expect(result).toBeNull();
    });

    it('replaces files when multiple is true and selection mode is replace', () => {
      const existing = createFile('existing.txt');
      const selected = createFile('selected.txt');

      const result = getSelectedFiles([selected], true, 'replace', [existing]);

      expect(result).toEqual([selected]);
    });

    it('appends files when multiple is true and selection mode is append', () => {
      const existing = createFile('existing.txt');
      const selected = createFile('selected.txt');

      const result = getSelectedFiles([selected], true, 'append', [existing]);

      expect(result).toEqual([existing, selected]);
    });

    it('converts a single existing File value into an array when appending', () => {
      const existing = createFile('existing.txt');
      const selected = createFile('selected.txt');

      const result = getSelectedFiles([selected], true, 'append', existing);

      expect(result).toEqual([existing, selected]);
    });

    it('removes duplicate files when appending', () => {
      const existing = createFile('same.txt');

      const result = getSelectedFiles([existing], true, 'append', [existing]);

      expect(result).toEqual([existing]);
    });
  });

  describe('filesToAcceptString', () => {
    it('returns string values unchanged', () => {
      expect(filesToAcceptString('.png')).toBe('.png');
    });

    it('joins array values with commas', () => {
      expect(filesToAcceptString(['.png', '.jpg', '.gif'])).toBe(
        '.png,.jpg,.gif',
      );
    });

    it('returns an empty string for null', () => {
      expect(filesToAcceptString(null)).toBe('');
    });
  });

  describe('formatFileName', () => {
    const translate = (key: string, params?: Record<string, unknown>) => {
      if (key === 'fileSelector.filesSelected') {
        return `${params?.['count']} files selected`;
      }

      return key;
    };

    it('returns the file name for a single File', () => {
      const file = createFile('photo.png');

      expect(formatFileName(file, translate)).toBe('photo.png');
    });

    it('returns translated file count for multiple files', () => {
      const files = [createFile('one.png'), createFile('two.png')];

      expect(formatFileName(files, translate)).toBe('2 files selected');
    });

    it('returns an empty string for null', () => {
      expect(formatFileName(null, translate)).toBe('');
    });

    it('returns an empty string for an empty array', () => {
      expect(formatFileName([], translate)).toBe('');
    });
  });
});
