import * as fs from 'fs';
import * as path from 'path';

import postcss from 'postcss';
import { withOptions } from 'tailwindcss/plugin.js';
import { CSSRuleObject } from 'tailwindcss/types/config';

interface PluginOptions {
  scope: string;
}

const preflightCssPath = path.resolve(require.resolve('tailwindcss'), '../css/preflight.css');

function convertToCSSRuleObject(rule: postcss.Rule): CSSRuleObject {
  const declarations: Record<string, string> = {};
  rule.nodes.forEach((node) => {
    if (node.type === 'decl') {
      declarations[node.prop] = node.value;
    }
  });
  return { [rule.selector]: declarations };
}

export const twPreflightScope = withOptions<PluginOptions>(
  (options) =>
    ({ addBase }) => {
      const preflightCss = fs.readFileSync(preflightCssPath, 'utf-8');
      const root = postcss.parse(preflightCss);
      const cssRules: CSSRuleObject[] = [];

      root.walkRules((rule) => {
        rule.selectors = rule.selectors.map((s) => `${s}:where(${options.scope}, ${options.scope} *)`);
        rule.selector = rule.selectors.join(',\n');
        if (rule.nodes.length > 0) {
          cssRules.push(convertToCSSRuleObject(rule));
        }
      });

      addBase(cssRules);
    },
  () => ({
    corePlugins: {
      preflight: false,
    },
  })
);
