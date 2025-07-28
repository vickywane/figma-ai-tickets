function convertMarkdown(markdown: string) {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\`(.*?)\`/gim, "<code>$1</code>")
    .replace(/\n$/gim, "<br />");
}

type Markdown = {
  content: string;
  className?: string;
};

const MarkdownRenderer = ({ content, className }: Markdown) => {
  if (!content) {
    return;
  }

  const html = convertMarkdown(content);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default MarkdownRenderer;
