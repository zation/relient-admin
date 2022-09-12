import {
  Button,
  Drawer,
  DrawerProps,
} from 'antd';
import React, { ReactNode } from 'react';
// import {
//   node,
//   bool,
//   object,
//   func,
//   arrayOf,
//   shape,
//   string,
//   oneOfType,
//   number,
// } from 'prop-types';
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
import { Style } from '../interface';

export interface DetailsItem<Model> {
  element?: ReactNode
  title?: string
  dataIndex?: string | string[]
  render?: (value: any, dataSource?: Model) => ReactNode
  display?: boolean | ((item: any, dataSource?: Model) => boolean)
  dataStyle?: Style
  titleStyle?: Style
  dark?: boolean
  key?: string
}

export interface DetailsProps<Model> {
  open: boolean
  title?: ReactNode
  dataSource?: Model
  items: DetailsItem<Model>[]
  itemTitleStyle?: Style
  itemDataStyle?: Style
  editButtonText?: string
  children?: ReactNode
  push?: DrawerProps['push']
  editable?: boolean
  openEditor?: (dataSource?: Model) => void
  close?: () => void
  defaultDisplay?: string
}

function RelientDetails<Model>({
  open,
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
  push,
  defaultDisplay = '-',
}: DetailsProps<Model>) {
  return (
    <Drawer
      open={open}
      title={(
        <div className="relient-admin-details-title">
          <div
            className="relient-admin-details-title-text"
          >
            {title || '查看详情'}
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
              {editButtonText || '编辑'}
            </Button>
          )}
        </div>
      )}
      onClose={close}
      width={528}
      closable={false}
      push={push}
    >
      <table className="relient-admin-details-table">
        <tbody>
          {flow(
            filter<DetailsItem<Model>>(({ dataIndex, display }) => display === true
              || isUndefined(display)
              || (isFunction(display)
                && display(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource))),
            reduce((newItems: DetailsItem<Model>[], item: DetailsItem<Model>) => {
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
}

// NOTICE: conflict with ts
// Details.propTypes = {
//   open: bool.isRequired,
//   title: node,
//   dataSource: object,
//   items: arrayOf(
//     shape({
//       element: node,
//       title: string,
//       dataIndex: oneOfType([string, arrayOf(string)]),
//       render: func,
//       display: oneOfType([bool, func]),
//       dataStyle: object,
//       titleStyle: object,
//       dark: bool,
//       key: string,
//     }),
//   ).isRequired,
//   itemTitleStyle: object,
//   itemDataStyle: object,
//   editButtonText: string,
//   children: node,
//   level: oneOfType([string, arrayOf(string)]),
//   levelMove: oneOfType([number, arrayOf(number), func]),
//   editable: bool,
//   openEditor: func,
//   close: func.isRequired,
//   defaultDisplay: string,
// };

export default RelientDetails;
