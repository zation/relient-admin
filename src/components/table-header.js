/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  string,
  func,
  shape,
  arrayOf,
  array,
  number,
  oneOfType,
  object,
  bool,
  elementType,
  any,
} from 'prop-types';
import { Input, Button, Select, DatePicker } from 'antd';
import { map, flow, join, prop } from 'lodash/fp';
import useI18N from '../hooks/use-i18n';
import Link from './link';
import FormPop from './form-pop';
import Details from './details';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const result = ({
  query,
  createButton,
  filter,
  reset,
  datePicker,
  details,
  detailsVisible,
  closeDetails,
  creator,
  creatorVisible,
  openCreator,
  closeCreator,
  onCreateSubmit,
  editor,
  editorVisible,
  openEditor,
  closeEditor,
  onEditSubmit,
}) => {
  const i18n = useI18N();

  return (
    <div className="relient-admin-table-header-root">
      {details && (
        <Details
          {...details}
          visible={detailsVisible}
          openEditor={() => openEditor(details.dataSource)}
          close={closeDetails}
        />
      )}

      {creator && (
        <FormPop
          {...creator}
          visible={creatorVisible}
          close={closeCreator}
          onSubmit={onCreateSubmit}
        />
      )}

      {editor && (
        <FormPop
          {...editor}
          visible={editorVisible}
          close={closeEditor}
          onSubmit={onEditSubmit}
        />
      )}

      <div className="relient-admin-table-header-button-wrapper">
        {createButton && (createButton.link ? (
          <Link to={createButton.link}>
            <Button type="primary" size="large">
              {createButton.text}
            </Button>
          </Link>
        ) : (
          <Button type="primary" size="large" onClick={createButton.onClick || openCreator}>
            {createButton.text}
          </Button>
        ))}
      </div>

      <div className="relient-admin-table-header-operations">
        {filter && map(({
          label,
          options,
          placeholder,
          dataKey,
          value,
          dropdownMatchSelectWidth = false,
        }) => (
          <div key={dataKey}>
            <span className="relient-admin-table-header-operation-label">{label}</span>
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
            <span className="relient-admin-table-header-operation-label">{label}</span>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={(
                _,
                selectedValue,
              ) => datePicker.onSelect(selectedValue, dataKey)}
              disabledDate={disabledDate}
            />
          </div>
        ))(datePicker.items)}

        {query && (query.fussy || query.fields) && (
          <div>
            {!query.fussy && (
              <Select
                onSelect={query.onFieldChange}
                value={query.field}
                className="relient-admin-table-header-operation-label"
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
              style={{ width: query.width || 362 }}
              placeholder={query.placeholder || (query.fussy ? i18n('searchBy', { keywords: flow(map(prop('text')), join('、'))(query.fields) }) : i18n('search'))}
              onChange={query.onValueChange}
              value={query.value}
            />
          </div>
        )}

        {reset && (
          <Button onClick={reset}>{i18n('reset')}</Button>
        )}
      </div>
    </div>
  );
};

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
  createButton: oneOfType([shape({
    text: string.isRequired,
    link: string,
    onClick: func,
  }), bool]),
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
  details: object,
  detailsVisible: bool,
  closeDetails: func,
  creator: shape({
    component: elementType,
    title: string,
    onSubmit: func,
    initialValues: object,
    fields: arrayOf(oneOfType([
      shape({
        name: string.isRequired,
        label: string,
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
        label: string,
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
  openEditor: func,
  closeCreator: func,
  closeEditor: func,
  creatorVisible: bool,
  editorVisible: bool,
  onCreateSubmit: func,
  onEditSubmit: func,
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
