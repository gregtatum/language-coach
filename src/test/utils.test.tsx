import * as Utils from 'src/utils';

describe('utils', () => {
  it('Can get a unique slug', () => {
    const slugs = [
      'quick-brown',
      'fox',
      'jumps-over-01',
      'the',
      'the-50',
      'lazy-dog',
      'lazy-dog-1',
      'lazy-dog-2',
      'lazy-dog-3',
    ];
    expect(Utils.getUniqueSlug(slugs, 'hello')).toBe('hello');
    expect(Utils.getUniqueSlug(slugs, 'quick-brown')).toBe('quick-brown-2');
    expect(Utils.getUniqueSlug(slugs, 'lazy-dog')).toBe('lazy-dog-4');
    expect(Utils.getUniqueSlug(slugs, 'lazy-dog-3')).toBe('lazy-dog-3-2');
    expect(Utils.getUniqueSlug(slugs, 'jumps-over')).toBe('jumps-over');
    expect(Utils.getUniqueSlug(slugs, 'the')).toBe('the-51');
  });

  it('can compute source sentences', () => {
    expect(Utils.getSourceSentences('This is a source sentence.')).toEqual([
      {
        endIndex: 26,
        startIndex: 0,
        text: 'This is a source sentence.',
      },
    ]);

    expect(Utils.getSourceSentences('Sentence 1. Sentence 2.')).toEqual([
      {
        endIndex: 11,
        startIndex: 0,
        text: 'Sentence 1.',
      },
      {
        endIndex: 23,
        startIndex: 11,
        text: 'Sentence 2.',
      },
    ]);

    expect(Utils.getSourceSentences('')).toEqual([]);
    expect(Utils.getSourceSentences('  \n    \t  ')).toEqual([]);

    expect(
      Utils.getSourceSentences('   Sentence 1\n Sentence 2.   \n '),
    ).toEqual([
      {
        endIndex: 14,
        startIndex: 0,
        text: 'Sentence 1',
      },
      {
        endIndex: 26,
        startIndex: 14,
        text: 'Sentence 2.',
      },
    ]);
  });

  it('can create slugs', () => {
    expect(Utils.sluggify('Hello, World!')).toEqual('hello-world');
    expect(Utils.sluggify('¡Hola, Mundo!')).toEqual('hola-mundo');
    expect(Utils.sluggify('Héllö, Wôrld!')).toEqual('hello-world');
    expect(Utils.sluggify(' This is a --- slug   ')).toEqual('this-is-a-slug');
    expect(Utils.sluggify('---This is a slug---')).toEqual('this-is-a-slug');
    expect(Utils.sluggify('')).toEqual('');
  });
});
