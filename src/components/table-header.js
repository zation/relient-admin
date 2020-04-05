import React from 'react';
import { string, func, shape, arrayOf, array, number, oneOfType, object, bool, elementType, any } from 'prop-types';
import { Input, Button, Select, DatePicker } from 'antd';
import { map, flow, join, prop } from 'lodash/fp';
import Link from './link';
import FormModal from './form-modal';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const result = ({
  query,
  createLink,
  filter,
  reset,
  datePicker,
  creatorVisible,
  editorVisible,
  creator,
  editor,
  openCreator,
  closeCreator,
  closeEditor,
  onCreateSubmit,
  onEditSubmit,
}) => (
  <div className="relient-admin-table-header">
    {creator && (creator.component || FormModal)({
      title: creator.title || '创建',
      visible: creatorVisible,
      onCancel: closeCreator,
      onSubmit: onCreateSubmit,
      initialValues: creator.initialValues,
      fields: creator.fields,
      layout: creator.layout,
      checkEditing: creator.checkEditing,
    })}

    {editor && (editor.component || FormModal)({
      title: editor.title || '编辑',
      visible: editorVisible,
      onCancel: closeEditor,
      onSubmit: onEditSubmit,
      initialValues: editor.initialValues,
      fields: editor.fields,
      layout: editor.layout,
      checkEditing: editor.checkEditing,
    })}

    <div className="relient-admin-table-header-operations">
      {query && (query.fussy || query.fields) && (
        <div>
          {!query.fussy && (
            <Select
              onSelect={query.onFieldChange}
              value={query.field}
              style={{ marginRight: 10 }}
              dropdownMatchSelectWidth={false}
            >
              {map(({ key, text }) => (
                <Option
                  value={key}
                  key={key}
                >
                  {text}
                </Option>
              ))(query.fields)}
            </Select>
          )}
          <Search
            style={{ width: query.width || 300 }}
            placeholder={query.placeholder || (query.fussy ? `根据 ${flow(map(prop('text')), join('、'))(query.fields)} 搜索` : '搜索')}
            onChange={query.onValueChange}
            value={query.value}
          />
        </div>
      )}

      {filter && map(({
        label,
        options,
        placeholder,
        dataKey,
        value,
        dropdownMatchSelectWidth = false,
      }) => (
        <div key={dataKey}>
          <span style={{ marginRight: 10 }}>{label}</span>
          <Select
            onSelect={(selectedValue) => filter.onSelect(selectedValue, dataKey)}
            placeholder={placeholder}
            value={value}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          >
            {map(({ text, value: optionValue, disabled, className: optionClassName }) => (
              <Option
                value={optionValue}
                key={optionValue}
                disabled={disabled}
                className={optionClassName}
              >
                {text}
              </Option>
            ))(options)}
          </Select>
        </div>
      ))(filter.items)}

      {datePicker && map(({ label, dataKey, disabledDate }) => (
        <div key={dataKey}>
          <span style={{ marginRight: 10 }}>{label}</span>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(_, selectedValue) => datePicker.onSelect(selectedValue, dataKey)}
            disabledDate={disabledDate}
          />
        </div>
      ))(datePicker.items)}

      {reset && (
        <Button onClick={reset}>重置</Button>
      )}
    </div>

    {creator && (
      <Button type="primary" size="large" onClick={openCreator}>
        {creator.title || '创建'}
      </Button>
    )}

    {createLink && (
      <Link to={createLink.link}>
        <Button type="primary" size="large">
          {createLink.text}
        </Button>
      </Link>
    )}
  </div>
);

result.propTypes = {
  query: shape({
    onFieldChange: func.isRequired,
    onValueChange: func.isRequired,
    field: string,
    value: string,
    width: number,
    fields: array,
    placeholder: string,
    fussy: bool,
  }),
  createLink: shape({
    text: string.isRequired,
    link: string.isRequired,
  }),
  filter: shape({
    items: arrayOf(shape({
      label: string,
      placeholder: string,
      options: array.isRequired,
      dataKey: string.isRequired,
      disabled: bool,
      value: oneOfType([string, number]),
    })).isRequired,
    onSelect: func.isRequired,
  }),
  creator: shape({
    component: elementType,
    title: string,
    onSubmit: func,
    initialValues: object,
    fields: arrayOf(oneOfType([
      shape({
        name: string.isRequired,
        label: string.isRequired,
        htmlType: string,
        options: array,
        placeholder: string,
        validate: oneOfType([func, array]),
        required: bool,
        component: any,
      }),
      func,
    ])),
    layout: object,
  }),
  editor: shape({
    component: elementType,
    title: string,
    onSubmit: func,
    initialValues: object,
    fields: arrayOf(oneOfType([
      shape({
        name: string.isRequired,
        label: string.isRequired,
        htmlType: string,
        options: array,
        placeholder: string,
        validate: oneOfType([func, array]),
        required: bool,
        component: any,
      }),
      func,
    ])),
    layout: object,
  }),
  openCreator: func,
  closeCreator: func,
  closeEditor: func,
  creatorVisible: bool,
  editorVisible: bool,
  onCreateSubmit: func.isRequired,
  onEditSubmit: func.isRequired,
  datePicker: shape({
    items: arrayOf(shape({
      label: string,
      dataKey: string.isRequired,
      value: array,
      disabledDate: func,
    })).isRequired,
    onSelect: func.isRequired,
  }),
  reset: func,
};

result.displayName = __filename;

export default result;
