/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { action } from 'mobx';
import { observer, Observer } from 'mobx-react';
import classNames from 'classnames/bind';
import PickBox, { PickType } from '../PickBox/PickBox';
import SelectionModel from './SelectionModel';
import styles from './SelectionGroup.scss';

const cx = classNames.bind(styles);

@observer
export default class SelectionGroup extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    const model = new SelectionModel({
      items: props.items,
      multiple: props.multiple || false,
      textField: props.textField,
      valueField: props.valueField,
    });

    if (value) {
      const selectedValues = Array.isArray(value) ? value : [value];
      model.selectByValues(selectedValues);
    }

    this._model = model;
  }

  get model() {
    return this._model;
  }

  componentDidUpdate(prevProps) {
    let modelChange = false;
    const { props: nextProps } = this;

    const { value, items } = nextProps;
    if (items && items !== prevProps.items) {
      modelChange = true;
      this.updateModel(nextProps);
    }

    if (value && (value !== prevProps.value || modelChange)) {
      const values = Array.isArray(value) ? value : [value];

      this.model.selectByValues(values);
    }
  }

  updateModel(props) {
    const { items = [], multiple, textField, valueField } = props;

    if (this.model) {
      this.model.update({
        items,
        multiple,
        textField,
        valueField,
      });
    }
  }

  @action
  onChange = ({ id, selected }) => {
    const { onChange, type = '' } = this.props;
    if (type === 'radio' && this.model.selection.ids.find(selectedId => selectedId === id)) return;
    this.model.select(id, !selected);
    onChange && onChange(this.model.selection);
  };

  _itemTemplate = (item, { selectItem, pickType = PickType.CHECKBOX }) => (
    <PickBox tabIndex={0} onClick={selectItem} value={item.id} label={item.text} checked={item.selected} pickType={pickType} />
  );

  renderOptions = items => {
    const { itemTemplate, cols, gutter, itemClassName, pickType } = this.props;
    const theItemTemplate = itemTemplate || this._itemTemplate;

    return items.map((item, index) => {
      const selectItem = e => {
        e.preventDefault();
        e.stopPropagation();
        this.onChange(item);
      };

      let style;

      if (cols) {
        style = { width: '100%' };
        if (cols > 1) {
          const width = `calc(${100 / cols}% + ${gutter / cols}px - ${gutter}px)`;
          const marginRight = (index + 1) % cols === 0 ? 0 : gutter;
          style = { width, marginRight };
        }
      }
      return (
        <Observer key={item.id}>
          {() => (
            <div className={cx('item', itemClassName)} style={style}>
              {theItemTemplate(item, { selectItem, pickType })}
            </div>
          )}
        </Observer>
      );
    });
  };

  render({ className, cols } = this.props) {
    return (
      <div data-component="selection-group" className={cx('SelectionGroup', className, { hasCols: !!cols })}>
        {this.renderOptions(this.model.items)}
      </div>
    );
  }
}
