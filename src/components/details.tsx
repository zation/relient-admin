import { Button, Drawer } from 'antd';
import React, { ReactNode } from 'react';
import {
  node,
  bool,
  object,
  func,
  arrayOf,
  shape,
  string,
  oneOfType,
  array,
  number,
} from 'prop-types';
import {
  reduce,
  flow,
  map,
  prop,
  filter,
  isUndefined,
  isFunction,
  last,
  join,
} from 'lodash/fp';
import { useI18N } from 'relient/i18n';
import { Style } from '../interface';

type LevelMove = number | [number, number];
export interface DetailsItem<DataSource = any> {
  element?: ReactNode
  title?: string
  dataIndex?: string | string[]
  render?: (value: any, dataSource: DataSource) => ReactNode
  display?: boolean
  dataStyle?: Style
  titleStyle?: Style
  dark?: boolean
  key?: string
}

export interface DetailsProps<DataSource = any> {
  visible: boolean
  title?: string
  dataSource?: DataSource
  items: DetailsItem<DataSource>[]
  itemTitleStyle?: Style
  itemDataStyle?: Style
  editButtonText?: string
  children?: ReactNode
  level?: string | string[] | null
  levelMove?: LevelMove | ((event: { target: HTMLElement; open: boolean }) => LevelMove)
  editable?: boolean
  openEditor?: (dataSource?: DataSource) => void
  close?: () => void
  id: string
  defaultDisplay: string
}

const result = ({
  visible,
  title,
  dataSource,
  items,
  editable,
  editButtonText,
  openEditor,
  close,
  itemTitleStyle,
  itemDataStyle,
  children,
  level,
  levelMove,
  id = 'details',
  defaultDisplay = '-',
}: DetailsProps) => {
  const i18n = useI18N();

  return (
    <Drawer
      visible={visible}
      title={(
        <div className="relient-admin-details-title">
          <div
            className="relient-admin-details-title-text"
          >
            {title || i18n('viewDetails')}
          </div>
          {editable && (
            <Button
              type="primary"
              onClick={() => {
                if (openEditor) {
                  openEditor(dataSource);
                }
              }}
            >
              {editButtonText || i18n('edit')}
            </Button>
          )}
        </div>
      )}
      onClose={close}
      width={528}
      closable={false}
      // @ts-ignore
      level={level}
      // @ts-ignore
      levelMove={levelMove}
      id={id}
    >
      <table className="relient-admin-details-table">
        <tbody>
          {flow(
            filter(({ dataIndex, display }) => display === true
              || isUndefined(display)
              || (isFunction(display)
                && display(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource))),
            reduce((newItems: DetailsItem[], item: DetailsItem) => {
              if (flow(last, prop('dark'))(newItems) || item.element) {
                return [...newItems, item];
              }
              return [...newItems, { ...item, dark: true }];
            }, []),
            map(({
              title: itemTitle,
              dataIndex,
              render,
              element,
              dark,
              key,
              dataStyle,
              titleStyle,
            }) => {
              let finalKey = key || itemTitle;
              if (typeof dataIndex === 'string') {
                finalKey = dataIndex;
              } else if (dataIndex instanceof Array) {
                finalKey = join('.')(dataIndex);
              }
              let finalDisplay: ReactNode = defaultDisplay;
              if (render) {
                finalDisplay = render(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource);
              } else if (dataIndex) {
                finalDisplay = prop(dataIndex)(dataSource);
              }
              return (
                <tr
                  className={dark ? 'relient-admin-details-dark' : 'relient-admin-details-light'}
                  key={finalKey}
                >
                  {element ? (
                    <td
                      className="relient-admin-details-element"
                      colSpan={2}
                    >
                      {element}
                    </td>
                  ) : (
                    <>
                      <td
                        className="relient-admin-details-item-title"
                        style={{ ...itemTitleStyle, ...titleStyle }}
                      >
                        {itemTitle}
                      </td>
                      <td
                        className="relient-admin-details-item-content"
                        style={{ ...itemDataStyle, ...dataStyle }}
                      >
                        {finalDisplay}
                      </td>
                    </>
                  )}
                </tr>
              );
            }),
          )(items)}
        </tbody>
      </table>
      {children}
    </Drawer>
  );
};

result.propTypes = {
  title: node,
  dataSource: object,
  visible: bool.isRequired,
  openEditor: func,
  editable: bool,
  close: func.isRequired,
  items: arrayOf(
    shape({
      element: node,
      title: string,
      dataIndex: oneOfType([string, array]),
      render: func,
      display: bool,
      dataStyle: object,
      titleStyle: object,
      dark: bool,
      key: string,
    }),
  ).isRequired,
  itemTitleStyle: object,
  itemDataStyle: object,
  editButtonText: string,
  children: node,
  level: oneOfType([string, arrayOf(string)]),
  levelMove: oneOfType([number, arrayOf(number), func]),
  id: string,
  defaultDisplay: string,
};

result.displayName = __filename;

export default result;
