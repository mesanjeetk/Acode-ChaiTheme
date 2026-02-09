import plugin from '../plugin.json';
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const editorThemes = acode.require("editorThemes");
const settings = acode.require('settings');
const { editor } = editorManager;


const config = {
  name: "chai-theme",
  dark: true,

  // Core surfaces
  background: "#1c1815",          // deep chai brown
  foreground: "#f5efe6",          // milk tea foam
  activeLine: "#2a241f",

  // Selection & cursor
  selection: "#6f4e3766",          // soft chai brown
  selectionMatch: "#a475514d",
  cursor: "#f5efe6",

  // UI chrome
  dropdownBackground: "#231e1a",
  dropdownBorder: "#3a312b",
  matchingBracket: "#5a4638",

  // Gutter
  lineNumber: "#7d6a5c",
  lineNumberActive: "#f5efe6",

  // Syntax
  keyword: "#e0a96d",              // saffron
  variable: "#f5efe6",
  parameter: "#e6d3b1",
  function: "#9fc49f",             // pistachio
  string: "#d8a657",               // jaggery caramel
  constant: "#e0a96d",
  type: "#c7b299",                 // almond
  class: "#c7b299",
  number: "#b5cea8",               // soft mint (still readable)
  comment: "#8c7a6b",              // cinnamon dust
  heading: "#f2c078",
  regexp: "#d3869b",               // rose spice
  tag: "#c7b299",
  operator: "#f5efe6",
  angleBracket: "#9c8878",

  // Errors & invalid
  invalid: "#ff6b6b",
};


const chaiTheme = EditorView.theme({
  "&": {
    color: config.foreground,
    backgroundColor: config.background,
  },

  ".cm-content": { caretColor: config.cursor },

  ".cm-cursor, .cm-dropCursor": { borderLeftColor: config.cursor },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
  {
    backgroundColor: config.selection,
  },

  ".cm-panels": {
    backgroundColor: config.dropdownBackground,
    color: config.foreground,
  },
  ".cm-panels.cm-panels-top": {
    borderBottom: `1px solid ${config.dropdownBorder}`,
  },
  ".cm-panels.cm-panels-bottom": {
    borderTop: `1px solid ${config.dropdownBorder}`,
  },

  ".cm-searchMatch": {
    backgroundColor: config.dropdownBackground,
    outline: `1px solid ${config.dropdownBorder}`,
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: config.selectionMatch,
  },

  ".cm-activeLine": { backgroundColor: config.activeLine },
  ".cm-selectionMatch": { backgroundColor: config.selectionMatch },

  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: config.matchingBracket,
    outline: "none",
  },

  ".cm-gutters": {
    backgroundColor: config.background,
    color: config.lineNumber,
    border: "none",
  },
  ".cm-activeLineGutter": { backgroundColor: config.background },

  ".cm-lineNumbers .cm-gutterElement": { color: config.lineNumber },
  ".cm-lineNumbers .cm-activeLineGutter": { color: config.lineNumberActive },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: config.foreground,
  },
  ".cm-tooltip": {
    border: `1px solid ${config.dropdownBorder}`,
    backgroundColor: config.dropdownBackground,
    color: config.foreground,
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: config.foreground,
    borderBottomColor: config.foreground,
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      background: config.selectionMatch,
      color: config.foreground,
    },
  },
}, { dark: config.dark })


const chaiHighlightStyle = HighlightStyle.define([
  {
    tag: [
      t.keyword,
      t.operatorKeyword,
      t.modifier,
      t.color,
      t.constant(t.name),
      t.standard(t.name),
      t.standard(t.tagName),
      t.special(t.brace),
      t.atom,
      t.bool,
      t.special(t.variableName),
    ],
    color: config.keyword,
  },
  { tag: [t.controlKeyword, t.moduleKeyword], color: "#c586c0" },
  {
    tag: [
      t.name,
      t.deleted,
      t.character,
      t.macroName,
      t.propertyName,
      t.variableName,
      t.labelName,
      t.definition(t.name),
    ],
    color: config.variable,
  },
  { tag: t.heading, fontWeight: "bold", color: config.heading },
  {
    tag: [
      t.typeName,
      t.className,
      t.tagName,
      t.number,
      t.changed,
      t.annotation,
      t.self,
      t.namespace,
    ],
    color: config.type,
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: config.function,
  },
  { tag: [t.number], color: config.number },
  {
    tag: [t.operator, t.punctuation, t.separator, t.url, t.escape, t.regexp],
    color: config.operator,
  },
  { tag: [t.regexp], color: config.regexp },
  {
    tag: [t.special(t.string), t.processingInstruction, t.string, t.inserted],
    color: config.string,
  },
  { tag: [t.angleBracket], color: config.angleBracket },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: [t.meta, t.comment], color: config.comment },
  { tag: t.link, color: config.comment, textDecoration: "underline" },
  { tag: t.invalid, color: config.invalid },
])

function chai() {
  return [chaiTheme, syntaxHighlighting(chaiHighlightStyle)]
}


class AcodePlugin {
  constructor() {
    this.themeName = config.name;
    if (!editorThemes.get(this.themeName)) {
      editorThemes.register(
        this.themeName,
        "Chai",
        !!config.dark,
        () => chai(),
        config
      )
    }
    this.isInitialized = false;
    this.onThemeChange = this.onThemeChange.bind(this);
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const currentTheme = settings.get('editorTheme');
    if (currentTheme === this.themeName) {
      editor.setTheme(this.themeName)
    }

    settings.on("update:editorTheme", this.onThemeChange)

  }

  onThemeChange(value) {
    if (value === this.themeName) {
      editor.setTheme(this.themeName);
      settings.update({ editorTheme: this.themeName })
    }
  }

  async destroy() {
    if (editorThemes.get(this.themeName)) {
      editorThemes.unregister(this.themeName);
    }
    if (!this.isInitialized) return;
    this.isInitialized = false;

    settings.off('update:editorTheme', this.onThemeChange);
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
