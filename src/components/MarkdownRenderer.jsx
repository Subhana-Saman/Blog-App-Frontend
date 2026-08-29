import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer({
content,
}) {

return (

```
<div
  className="
    prose
    prose-invert
    max-w-none
  "
>

  <ReactMarkdown
    remarkPlugins={[
      remarkGfm,
    ]}
    rehypePlugins={[
      rehypeHighlight,
    ]}
  >
    {content}
  </ReactMarkdown>

</div>
```

);

}
