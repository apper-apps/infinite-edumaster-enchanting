import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = '내용을 입력하세요', 
  htmlPlaceholder = 'HTML 태그를 사용할 수 있습니다',
  isHtml = false,
  onHtmlToggle,
  className = '',
  rows = 10,
  ...props 
}) => {
  const [mode, setMode] = useState(isHtml ? 'html' : 'visual');
  const editorRef = useRef(null);

  useEffect(() => {
    setMode(isHtml ? 'html' : 'visual');
  }, [isHtml]);

  const handleModeToggle = () => {
    const newMode = mode === 'visual' ? 'html' : 'visual';
    setMode(newMode);
    if (onHtmlToggle) {
      onHtmlToggle(newMode === 'html');
    }
  };

  const formatText = (command, value = null) => {
    if (mode === 'html') return;
    
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const insertHTML = (htmlTag, isBlock = false) => {
    if (mode === 'visual') return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let insertion;
    if (isBlock) {
      insertion = `${htmlTag}${selectedText || '내용을 입력하세요'}</${htmlTag.replace('<', '</')}>`;
    } else {
      insertion = `${htmlTag}${selectedText}</${htmlTag.replace('<', '</')}>`;
    }
    
    const newValue = value.substring(0, start) + insertion + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + insertion.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleVisualChange = () => {
    if (editorRef.current && mode === 'visual') {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleHTMLChange = (e) => {
    if (mode === 'html') {
      onChange(e.target.value);
    }
  };

  const toolbarButtons = [
    { command: 'bold', icon: 'Bold', title: '굵게' },
    { command: 'italic', icon: 'Italic', title: '기울임' },
    { command: 'underline', icon: 'Underline', title: '밑줄' },
    { command: 'insertOrderedList', icon: 'List', title: '번호 목록' },
    { command: 'insertUnorderedList', icon: 'ListOrdered', title: '불릿 목록' },
    { command: 'createLink', icon: 'Link', title: '링크' },
  ];

  const htmlButtons = [
    { tag: '<strong>', label: 'B', title: '굵게' },
    { tag: '<em>', label: 'I', title: '기울임' },
    { tag: '<u>', label: 'U', title: '밑줄' },
    { tag: '<h1>', label: 'H1', title: '제목 1', isBlock: true },
    { tag: '<h2>', label: 'H2', title: '제목 2', isBlock: true },
    { tag: '<h3>', label: 'H3', title: '제목 3', isBlock: true },
    { tag: '<p>', label: 'P', title: '문단', isBlock: true },
    { tag: '<ul><li>', label: 'UL', title: '불릿 목록' },
    { tag: '<ol><li>', label: 'OL', title: '번호 목록' },
  ];

  return (
    <div className={cn("border border-gray-300 rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-300">
        <div className="flex items-center gap-1">
          {mode === 'visual' ? (
            toolbarButtons.map((btn) => (
              <Button
                key={btn.command}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (btn.command === 'createLink') {
                    const url = prompt('링크 URL을 입력하세요:');
                    if (url) formatText(btn.command, url);
                  } else {
                    formatText(btn.command);
                  }
                }}
                title={btn.title}
                className="p-2 h-8 w-8"
              >
                <ApperIcon name={btn.icon} size={14} />
              </Button>
            ))
          ) : (
            htmlButtons.map((btn, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertHTML(btn.tag, btn.isBlock)}
                title={btn.title}
                className="p-1 h-8 min-w-8 text-xs font-mono"
              >
                {btn.label}
              </Button>
            ))
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleModeToggle}
            className="flex items-center gap-1 text-xs"
          >
            <ApperIcon name={mode === 'visual' ? 'Code' : 'Eye'} size={14} />
            {mode === 'visual' ? 'HTML' : '미리보기'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          className="p-3 min-h-[200px] focus:outline-none prose max-w-none"
          style={{ minHeight: `${rows * 1.5}rem` }}
          onInput={handleVisualChange}
          onBlur={handleVisualChange}
          dangerouslySetInnerHTML={{ __html: value }}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <textarea
          ref={editorRef}
          value={value}
          onChange={handleHTMLChange}
          placeholder={htmlPlaceholder}
          rows={rows}
          className="w-full p-3 focus:outline-none font-mono text-sm resize-none"
          {...props}
        />
      )}
      
      {/* Character count */}
      <div className="px-3 py-1 bg-gray-50 border-t border-gray-300 text-xs text-gray-500 text-right">
        {mode === 'html' ? `${value.length} 문자` : `${value.replace(/<[^>]*>/g, '').length} 문자`}
      </div>
    </div>
  );
};

export default RichTextEditor;