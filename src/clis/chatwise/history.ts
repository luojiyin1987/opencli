import { cli, Strategy } from '../../registry.js';
import type { IPage } from '../../types.js';

export const historyCommand = cli({
  site: 'chatwise',
  name: 'history',
  description: 'List conversation history in ChatWise sidebar',
  domain: 'localhost',
  strategy: Strategy.UI,
  browser: true,
  args: [],
  columns: ['Index', 'Title'],
  func: async (page: IPage) => {
    const items = await page.evaluate(`
      (function() {
        const results = [];
        const selectors = [
          '[class*="sidebar"] [class*="item"]',
          '[class*="conversation-list"] a',
          '[class*="chat-list"] > *',
          'nav a',
          'aside a',
          '[role="listbox"] [role="option"]',
        ];
        
        for (const sel of selectors) {
          const nodes = document.querySelectorAll(sel);
          if (nodes.length > 0) {
            nodes.forEach((n, i) => {
              const text = (n.textContent || '').trim().substring(0, 100);
              if (text) results.push({ Index: i + 1, Title: text });
            });
            break;
          }
        }
        
        return results;
      })()
    `);

    if (items.length === 0) {
      return [{ Index: 0, Title: 'No history found. Ensure the sidebar is visible.' }];
    }

    return items;
  },
});
