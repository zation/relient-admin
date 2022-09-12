/* eslint-disable react/jsx-props-no-spreading,prefer-promise-reject-errors */
import React, {
  useMemo,
} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { IProps } from '@tinymce/tinymce-react/lib/es2015/main/ts/components/Editor';
import type { IEvents } from '@tinymce/tinymce-react/lib/es2015/main/ts/Events';
import {
  func,
  string,
  object,
} from 'prop-types';
import tinymce, {
  EditorOptions,
} from 'tinymce/tinymce';
import 'tinymce/models/dom/model';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/emoticons/js/emojis';
// @ts-ignore
import contentCss from 'tinymce/skins/content/default/content.min.css?inline';
// @ts-ignore
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline';

import zhCN from './editor-zh';

tinymce.addI18n('zh_CN', zhCN);

const getImageUploadHandler = ({ uploadUrl }: { uploadUrl?: string }): EditorOptions['images_upload_handler'] => (
  blobInfo,
  progress,
) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl || `${window.location.origin}/api/resource`);

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
  onChange: IProps['onEditorChange']
  uploadUrl?: string
  language?: 'en_US' | 'zh_CN'
}

const defaultInit = {
  height: 500,
  skin: false,
  menubar: false,
  plugins: [
    'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
    'searchreplace', 'table', 'wordcount',
  ],
  toolbar: 'undo redo | blocks | '
    + 'bold italic forecolor | alignleft aligncenter '
    + 'alignright alignjustify | bullist numlist outdent indent | '
    + 'image | removeformat | help',
  content_css: false,
  content_style: [contentCss, contentUiCss].join('\n'),
};

function RelientEditor({
  onChange,
  initialValue,
  value,
  init,
  uploadUrl,
  language = 'zh_CN',
  ...props
}: EditorProps) {
  const imageUploadHandler = useMemo(() => getImageUploadHandler({ uploadUrl }), [uploadUrl]);

  return (
    <Editor
      onEditorChange={onChange}
      initialValue={initialValue}
      value={value}
      init={{
        ...defaultInit,
        language,
        images_upload_handler: imageUploadHandler,
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
