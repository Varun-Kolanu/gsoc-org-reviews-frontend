import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownComponent = ({ children }) => {
    return (
        <Markdown remarkPlugins={[remarkGfm]}>
            {children}
        </Markdown>
    )
}