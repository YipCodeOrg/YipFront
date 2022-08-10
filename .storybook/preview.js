import ReactRouterDecorator from "./ReactRouterDecorator"
import LayoutDecorator from "./LayoutDecorator"

export const decorators = [LayoutDecorator, ReactRouterDecorator];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}