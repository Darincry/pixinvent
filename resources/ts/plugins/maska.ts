import { vMaska } from "maska/vue"
import type { App } from 'vue'

export default function (app: App) {
  app.directive('maska', vMaska)
}
