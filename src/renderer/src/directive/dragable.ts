import type { Directive } from 'vue'
export const vDraggable: Directive = {
  mounted: function (el: HTMLElement) {
    el.draggable = true
    let offsetX = 0
    let offsetY = 0
    el.ondragstart = function (e) {
      offsetX = e.offsetX
      offsetY = e.offsetY
    }
    el.ondragend = function (e) {
      el.style.top = e.clientY - offsetY + 'px'
      el.style.left = e.clientX - offsetX + 'px'
    }
  }
}
