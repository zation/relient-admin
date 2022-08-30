/* eslint-disable react/jsx-props-no-spreading,prefer-promise-reject-errors */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { IProps } from '@tinymce/tinymce-react/lib/es2015/main/ts/components/Editor';
import type { IEvents } from '@tinymce/tinymce-react/lib/es2015/main/ts/Events';
import {
  func,
  string,
  object,
} from 'prop-types';
import type {
  Editor as TinyMCEEditor,
  EditorManager,
  EditorOptions,
} from 'tinymce';
import { ConfigContext } from 'antd/lib/config-provider';
// @ts-ignore
import contentCss from 'tinymce/skins/content/default/content.min.css?inline';
// @ts-ignore
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline';

import zhCN from './editor-zh';

const imageUploadHandler: EditorOptions['images_upload_handler'] = (
  blobInfo,
  progress,
) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${global.location.origin}/api/resource`);

  xhr.upload.onprogress = (e) => {
    if (progress) {
      progress((e.loaded / e.total) * 100);
    }
  };

  xhr.onload = () => {
    if (xhr.status === 403) {
      reject({
        message: `HTTP Error: ${xhr.status}`,
        remove: true,
      });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      reject({
        message: `HTTP Error: ${xhr.status}`,
      });
      return;
    }

    const json = JSON.parse(xhr.responseText);

    if (!json || typeof json.url !== 'string') {
      reject({
        message: `Response missing url: ${xhr.responseText}`,
      });
      return;
    }

    resolve(json.url);
  };

  xhr.onerror = () => {
    reject({
      message: `Image upload failed due to a XHR Transport error. Code: ${xhr.status}`,
    });
  };

  const formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());

  xhr.send(formData);
});

export interface EditorProps extends Omit<IProps, 'onEditorChange'>, Omit<IEvents, 'onChange'> {
  onChange: (a: string, editor: TinyMCEEditor) => void
}

const defaultInit = {
  height: 500,
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap anchor',
    'searchreplace code fullscreen',
    'insertdatetime media table code help wordcount',
  ],
  toolbar: [
    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | '
    + 'bullist numlist outdent indent | image | removeformat | help',
  ],
  skin: false,
  content_css: false,
  // eslint-disable-next-line no-underscore-dangle
  content_style: [contentCss, contentUiCss].join('\n'),
  images_upload_handler: imageUploadHandler,
};

declare global {
  interface Window {
    tinymce: EditorManager
  }
}

function RelientEditor({
  onChange,
  initialValue,
  value,
  init,
  ...props
}: EditorProps) {
  const [isTinyMCELoaded, setIsTinyMCELoaded] = useState(false);
  useEffect(() => {
    async function loadTinyMCE() {
      await import('tinymce/tinymce');
      window.tinymce.addI18n('zh_CN', zhCN);
      await Promise.all([
        import('tinymce/models/dom/model'),
        import('tinymce/themes/silver'),
        import('tinymce/icons/default'),

        import('tinymce/plugins/advlist'),
        import('tinymce/plugins/anchor'),
        import('tinymce/plugins/autolink'),
        import('tinymce/plugins/link'),
        import('tinymce/plugins/image'),
        import('tinymce/plugins/lists'),
        import('tinymce/plugins/charmap'),
        import('tinymce/plugins/searchreplace'),
        import('tinymce/plugins/wordcount'),
        import('tinymce/plugins/code'),
        import('tinymce/plugins/fullscreen'),
        import('tinymce/plugins/insertdatetime'),
        import('tinymce/plugins/media'),
        import('tinymce/plugins/nonbreaking'),
        import('tinymce/plugins/table'),
        import('tinymce/plugins/template'),
        import('tinymce/plugins/help'),
      ]);
      setIsTinyMCELoaded(true);
    }

    loadTinyMCE();
  }, []);

  const { locale } = useContext(ConfigContext);

  return isTinyMCELoaded && (
    <Editor
      onEditorChange={onChange}
      initialValue={initialValue}
      value={value}
      init={{
        ...defaultInit,
        language: locale?.locale === 'zh-cn' ? 'zh_CN' : undefined,
        ...init,
      }}
      {...props}
    />
  );
}

RelientEditor.propTypes = {
  onChange: func,
  initialValue: string,
  init: object,
  value: string,
};

export default RelientEditor;
