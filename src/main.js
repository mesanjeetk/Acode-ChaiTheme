import plugin from '../plugin.json';
const settings = acode.require('settings');
const { editor } = editorManager;


const config = {
  name: "chai_theme",
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

class ChaiThemePlugin {
  constructor() {
    this.pluginId = "com.mesanjeet.acode.chaitheme";
    this.themeId = config.name;
    this.registered = false;
    this.onThemeChange = this.onThemeChange.bind(this);
    this.editorThemes = null;
  }

  buildExtensions() {
    const { cm, createTheme, createHighlightStyle } = this.editorThemes;
    const t = cm.tags;

    const highlight = createHighlightStyle([
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
    ]);

    return createTheme({
      dark: true,
      styles: {
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
      },
      highlightStyle: highlight,
    });
  }

  init() {
    this.editorThemes = acode.require("editorThemes");

    this.registered = this.editorThemes.register({
      id: this.themeId,
      caption: "Chai Theme",
      dark: true,
      getExtension: () => this.buildExtensions(),
      config
    });

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

  destroy() {
    if (!this.registered || !this.editorThemes) return;
    this.editorThemes.unregister(this.themeId);
    this.registered = false;
    settings.off('update:editorTheme', this.onThemeChange);
  }
}

if (window.acode) {
  const acodePlugin = new ChaiThemePlugin();
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
