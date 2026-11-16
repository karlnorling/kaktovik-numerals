import type { Preview } from '@storybook/html-vite';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: ['Introduction', 'Kaktovik Numerals', ['Number Builder', 'Digits']],
      },
    },
  },
};

export default preview;
