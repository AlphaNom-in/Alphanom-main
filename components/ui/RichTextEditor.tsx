'use client'

import { useRef, useEffect } from 'react'

interface Props {
  value?: string
  onChange?: (html: string) => void
  name?: string
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({
  value = '',
  onChange,
  name,
  placeholder = 'Write something…',
  minHeight = '200px',
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const hiddenRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
      setEmpty(value === '' || value === '<br>')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setEmpty(empty: boolean) {
    if (editorRef.current) editorRef.current.dataset.empty = empty ? 'true' : 'false'
  }

  function sync() {
    if (!editorRef.current) return
    let html = editorRef.current.innerHTML
    if (html === '<br>') {
      editorRef.current.innerHTML = ''
      html = ''
    }
    setEmpty(html === '')
    onChange?.(html)
    if (hiddenRef.current) hiddenRef.current.value = html
  }

  function exec(cmd: string) {
    editorRef.current?.focus()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(cmd, false)
    sync()
  }

  const btnStyle: React.CSSProperties = {
    width: '30px', height: '28px', borderRadius: '6px',
    border: '1.5px solid #D0DBE8', background: '#fff',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', padding: 0, flexShrink: 0,
    color: '#032655', fontSize: '0.85rem',
  }

  return (
    <>
      <div style={{ border: '1.5px solid #D0DBE8', borderRadius: '9px', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '4px', padding: '7px 10px', background: '#F5F8FC', borderBottom: '1px solid #EEF3F8', alignItems: 'center' }}>
          <button type="button" title="Bold (Ctrl+B)" onMouseDown={(e) => { e.preventDefault(); exec('bold') }} style={{ ...btnStyle, fontFamily: 'Georgia, serif', fontWeight: 700 }}>
            B
          </button>
          <button type="button" title="Italic (Ctrl+I)" onMouseDown={(e) => { e.preventDefault(); exec('italic') }} style={{ ...btnStyle, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            I
          </button>
          <button type="button" title="Underline (Ctrl+U)" onMouseDown={(e) => { e.preventDefault(); exec('underline') }} style={{ ...btnStyle, fontFamily: 'Georgia, serif', textDecoration: 'underline' }}>
            U
          </button>
          <div style={{ width: '1px', height: '16px', background: '#D0DBE8', margin: '0 2px' }} />
          <button type="button" title="Bullet list" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList') }} style={btnStyle}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.008v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          data-placeholder={placeholder}
          data-empty="true"
          className="rte-editor"
          style={{
            minHeight,
            padding: '10px 13px',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.875rem',
            color: '#032655',
            background: '#fff',
            outline: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box' as const,
            position: 'relative' as const,
          }}
        />
      </div>

      {name && <input ref={hiddenRef} type="hidden" name={name} defaultValue={value} />}

      <style>{`
        .rte-editor[data-empty="true"]::before {
          content: attr(data-placeholder);
          color: #96AFCA;
          position: absolute;
          top: 10px;
          left: 13px;
          pointer-events: none;
          white-space: pre-wrap;
          font-family: var(--font-ui);
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .rte-editor ul { margin: 4px 0; padding-left: 22px; list-style-type: disc; }
        .rte-editor ol { margin: 4px 0; padding-left: 22px; list-style-type: decimal; }
        .rte-editor li { margin: 2px 0; display: list-item; }
        .rte-editor b, .rte-editor strong { font-weight: 700; }
        .rte-editor i, .rte-editor em { font-style: italic; }
        .rte-editor u { text-decoration: underline; }
      `}</style>
    </>
  )
}
