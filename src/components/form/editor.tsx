/* eslint-disable no-prototype-builtins */
import React, { useEffect, useState } from 'react';
import { object, string, bool, array, func } from 'prop-types';
import { Upload } from 'antd';
import type { UploadRequestOption } from 'rc-upload/es/interface';
import cookie from 'js-cookie';
import { isString } from 'lodash/fp';
// @ts-ignore
import { ContentUtils } from 'braft-utils';
import type { EditorState, ControlType } from 'braft-editor';
import AUTHORIZATION from '../../constants/authorization';

let BraftEditor: any;

const getBody = (xhr: XMLHttpRequest) => {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

interface CustomRequest extends UploadRequestOption {
  value: EditorState | undefined
  onChange: (value: EditorState) => void
}

const customRequest = ({
  action,
  file,
  value,
  headers,
  onError,
  onProgress,
  onSuccess,
  withCredentials,
  onChange,
}: CustomRequest) => {
  const xhr = new XMLHttpRequest();

  if (onProgress && xhr.upload) {
    xhr.upload.onprogress = (event) => onProgress({
      ...event,
      percent: event.total > 0 ? (event.loaded / event.total) * 100 : 0,
    });
  }

  xhr.onerror = (e) => {
    if (onError) {
      onError(new Error('Custom request error'), e);
    }
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if ((xhr.status < 200 || xhr.status >= 300) && onError) {
      onError(new Error('Custom request error'), xhr);
    } else {
      onChange(
        ContentUtils.insertMedias(
          value,
          [{
            type: 'IMAGE',
            url: action.split('?')[0],
          }],
        ),
      );
      if (onSuccess) {
        onSuccess(getBody(xhr), xhr);
      }
    }
  };

  xhr.open('put', action, true);

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  // @ts-ignore
  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }
  xhr.setRequestHeader('Content-Type', '');

  // eslint-disable-next-line no-restricted-syntax
  for (const h in headers) {
    // @ts-ignore
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      // @ts-ignore
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  xhr.send(file);
};

export interface EditorProps {
  value: EditorState | undefined
  onChange: (value: EditorState) => void
  disabled?: boolean
  excludeControls?: string[]
  placeholder?: string
  controls?: ControlType[]
}

const result = ({
  value,
  onChange,
  placeholder,
  disabled,
  excludeControls,
  controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'text-indent', 'text-align', 'separator',
    'headings', 'list-ul', 'list-ol', 'blockquote', 'separator',
    'link', 'remove-styles', 'separator',
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload
          accept="image/*"
          action={async ({ name }) => {
            const authorization = cookie.get(AUTHORIZATION);
            const response = await fetch(
              `/api/file/presigned-upload-url?filename=${encodeURIComponent(name)}`,
              authorization ? {
                headers: {
                  'x-auth-token': authorization,
                },
              } : undefined,
            );
            const { presignedUrl } = await response.json();
            return presignedUrl;
          }}
          showUploadList={false}
          customRequest={(data) => customRequest({ ...data, onChange, value })}
        >
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button
            type="button"
            className="control-item button upload-button"
            data-title="插入图片"
          >
            图片
          </button>
        </Upload>
      ),
    },
  ],
}: EditorProps) => {
  const [isBraftEditorLoaded, setIsBraftEditorLoaded] = useState(!!BraftEditor);
  useEffect(() => {
    if (!isBraftEditorLoaded) {
      import('braft-editor').then((module) => {
        // @ts-ignore
        BraftEditor = module.default;
        setIsBraftEditorLoaded(true);
      });
    }
  }, [isBraftEditorLoaded]);

  return isBraftEditorLoaded && (
    // @ts-ignore
    <BraftEditor
      className="relient-admin-editor-root"
      // @ts-ignore
      value={isString(value) && BraftEditor ? BraftEditor.createEditorState(value) : value}
      onChange={(editorState: EditorState) => onChange(editorState)}
      placeholder={placeholder}
      readOnly={disabled}
      excludeControls={excludeControls}
      controls={controls}
    />
  );
};

result.propTypes = {
  value: object,
  onChange: func,
  placeholder: string,
  disabled: bool,
  excludeControls: array,
  controls: array,
};

result.displayName = __filename;

export default result;
