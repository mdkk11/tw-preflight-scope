import * as fs from 'fs';

import { twPreflightScope } from './tw-preflight-scope';
import { PluginCreator } from 'tailwindcss/types/config';

jest.mock('fs');
jest.mock('path');

describe('tw-preflight-scope', () => {
  describe('twPreflightScope plugin', () => {
    let addBase: jest.Mock;

    beforeEach(() => {
      addBase = jest.fn();
      (fs.readFileSync as jest.Mock).mockReturnValue(`
        body { margin: 0; }
        h1 { font-size: 2em; }
      `);
    });

    it('correctly scope basic CSS rules', () => {
      const plugin = twPreflightScope({ scope: '.my-scope' });
      plugin.handler({ addBase } as any);
      expect(addBase).toHaveBeenCalledWith([{ 'body:where(.my-scope, .my-scope *)': { margin: '0' } }, { 'h1:where(.my-scope, .my-scope *)': { 'font-size': '2em' } }]);
    });

    it('correctly handle rules with multiple selectors', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(`
        h1, h2 { font-weight: bold; }
      `);

      const addBase = jest.fn();
      const plugin = twPreflightScope({ scope: '.my-scope' });
      plugin.handler({ addBase } as any);

      expect(addBase).toHaveBeenCalledWith([
        {
          'h1:where(.my-scope, .my-scope *),\nh2:where(.my-scope, .my-scope *)': {
            'font-weight': 'bold',
          },
        },
      ]);
    });
  });

  describe('plugin options', () => {
    it('preflight of core plugin is disabled.', () => {
      const plugin = twPreflightScope({ scope: '.my-scope' });
      const config = plugin.config;

      expect(config).toEqual({
        corePlugins: {
          preflight: false,
        },
      });
    });
  });
});
