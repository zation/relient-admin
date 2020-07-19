import { Button, Drawer } from 'antd';
import React from 'react';
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
} from 'lodash/fp';
import { useI18N } from '../hooks';

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
}) => {
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
              onClick={openEditor}
            >
              {editButtonText || i18n('edit')}
            </Button>
          )}
        </div>
      )}
      onClose={close}
      width={528}
      closable={false}
      level={level}
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
            reduce((newItems, item) => {
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
            }) => (
              <tr
                className={dark ? 'relient-admin-details-dark' : 'relient-admin-details-light'}
                key={dataIndex || key}
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
                      {(render
                        ? render(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource)
                        : prop(dataIndex)(dataSource)) || '-'}
                    </td>
                  </>
                )}
              </tr>
            )),
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
    }),
  ).isRequired,
  itemTitleStyle: object,
  itemDataStyle: object,
  editButtonText: string,
  children: node,
  level: oneOfType([string, array]),
  levelMove: oneOfType([number, array, func]),
  id: string,
};

result.displayName = __filename;

export default result;
