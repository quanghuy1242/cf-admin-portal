export const editorTheme = {
  code: "bg-white dark:bg-gray-600 font-mono block py-2 px-8 leading-1 m-0 mt-2 mb-2 tab-2 overflow-x-auto relative before:absolute before:content-[attr(data-gutter)] before:bg-gray-200 dark:before:bg-gray-700 before:left-0 before:top-0 before:p-2 before:min-w-[25px] before:whitespace-pre-wrap before:text-right after:content-[attr(data-highlight-langrage)] after:right-3 after:absolute",
  heading: {
    h1: "text-3xl font-extrabold dark:text-white",
    h2: "text-2xl font-bold dark:text-white",
    h3: "text-xl font-bold dark:text-white",
    h4: "text-lg font-bold dark:text-white",
    h5: "font-bold dark:text-white",
  },
  image: "editor-image",
  link: "text-blue-600 dark:text-blue-500 hover:underline",
  list: {
    nested: {
      listitem: "pl-5 mt-2 space-y-1 list-decimal list-inside dark:text-white",
    },
    ol: "max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-white",
    ul: "max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-white",
    listitem: "dark:text-white",
  },
  ltr: "text-left",
  paragraph: "mb-2 relative",
  placeholder:
    "text-gray-500 overflow-hidden absolute top-4 left-4 text-sm select-none inline-block pointer-events-none",
  quote:
    "ml-5 text-sm text-gray-600 border-l-gray-500 border-l-4 border-solid pl-4",
  rtl: "text-right",
  text: {
    bold: "font-bold",
    italic: "italic",
    hashtag: "bg-slate-400 border-slate-500 border-b-[1]",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "[text-decoration:underline_line-through]",
    code: "font-mono text-[94%] bg-gray-100 dark:bg-gray-600 dark:text-white p-1 rounded",
  },
};
