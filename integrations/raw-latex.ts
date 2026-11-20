import { Markdown, type MarkdownOptions } from "@earendil-works/pi-tui";

// The wrapper's PTY needs the original TeX for TFormula to detect and render.
export default function () {
  const prototype = Markdown.prototype as typeof Markdown.prototype & Record<symbol, boolean>;
  const marker = Symbol.for("herdr.tformula.rawLatex");
  if (prototype[marker]) return;

  const render = prototype.render;
  prototype.render = function (width: number) {
    const markdown = this as unknown as { options: MarkdownOptions };
    markdown.options = { ...markdown.options, renderLatex: false };
    return render.call(this, width);
  };
  prototype[marker] = true;
}
