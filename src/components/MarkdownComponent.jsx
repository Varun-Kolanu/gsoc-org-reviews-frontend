import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

export const MarkdownComponent = ({ children }) => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                },
                h1: ({node, ...props}) => <h1 className='text-3xl font-bold' {...props} />,
                h2: ({node, ...props}) => <h2 className='text-2xl font-bold' {...props} />,
                h3: ({node, ...props}) => <h3 className='text-xl font-bold' {...props} />,
                h4: ({node, ...props}) => <h4 className='text-lg font-bold' {...props} />,
                h5: ({node, ...props}) => <h5 className='text-base font-bold' {...props} />,
                h6: ({node, ...props}) => <h6 className='text-sm font-bold' {...props} />,

                ul: ({node, ...props}) => <ul className='list-disc list-inside' {...props} />,
            }}
            >
            {children}
        </Markdown>
    )
}