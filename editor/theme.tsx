export const editorTheme = {
  code: "bg-white dark:bg-gray-600 font-mono block py-2 px-8 leading-1 m-0 mt-2 mb-2 tab-2 overflow-x-auto relative before:absolute before:content-[attr(data-gutter)] before:bg-gray-200 dark:before:bg-gray-700 before:left-0 before:top-0 before:p-2 before:min-w-[25px] before:whitespace-pre-wrap before:text-right after:content-[attr(data-highlight-langrage)] after:right-3 after:absolute",
  heading: {
    h1: "text-3xl leading-loose font-semibold dark:text-white",
    h2: "text-lg leading-loose uppercase text-gray-800 font-bold dark:text-white",
    h3: "text-sm leading-loose uppercase text-gray-900 font-bold dark:text-white",
    h4: "text-sm leading-loose font-bold dark:text-white",
    h5: "font-bold leading-loose dark:text-white",
  },
  image: "editor-image",
  link: "text-blue-500 dark:text-blue-400 hover:underline",
  list: {
    nested: {
      listitem: "pl-5 mt-2 space-y-1 list-decimal list-inside dark:text-white",
    },
    ol: "space-y-1 my-2 leading-5 text-gray-700 list-decimal list-inside dark:text-white",
    ul: "space-y-1 my-2 leading-5 text-gray-700 list-disc list-inside dark:text-white",
    listitem: "mx-5 dark:text-white",
  },
  ltr: "text-left",
  paragraph: "m-0 relative",
  placeholder:
    "text-gray-500 overflow-hidden absolute top-4 left-4 text-sm select-none inline-block pointer-events-none",
  quote:
    "ml-5 mb-3 text-gray-600 border-l-gray-400 border-l-4 border-solid pl-3",
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
