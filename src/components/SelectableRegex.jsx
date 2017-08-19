import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectableRegex.css';
import PlainText from './metas/PlainText.jsx';
import AnyOne from './metas/AnyOne.jsx';

export default class SelectableRegex extends Component {
  constructor(props) {
    super(props);
    const items = [{ id: 0, type: 'Text', meta: '' }];
    this.state = { items: items, regex: '' };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChangeRegex = this.handleChangeRegex.bind(this);
    this.handleClickAddButton = this.handleClickAddButton.bind(this);
    this.getMetaCharacter = this.getMetaCharacter.bind(this);
  }

  handleSelectChange(e) {
    const index = e.target.id;
    const value = e.target.value;
    this.setState((prevState) => {
      const newItem = Object.assign({}, prevState.items[index], {
        type: value
      });
      prevState.items[index] = newItem;
      return { items: prevState.items };
    });
  }

  handleChangeRegex(index, regex) {
    this.setState((prevState) => {
      const newItem = Object.assign({}, prevState.items[index], {
        meta: regex
      });
      prevState.items[index] = newItem;

      const metas = prevState.items.map((item) => (
        item.id === index ? regex : item.meta
      ));
      const newRegex = metas.join('');
      this.props.onChangeedRegex(newRegex);

      return { items: prevState.items, regex: newRegex };
    });
  }

  handleClickAddButton() {
    const { items } = this.state;
    const item = items[items.length - 1];
    const id = item.id + 1;
    const newItem = { id: id, type: 'Text', meta: '' };
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
    }));
  }

  getMetaCharacter(id) {
    switch (this.state.items[id].type) {
    case 'Text':
      return (<PlainText id={id} onChangeedRegex={this.handleChangeRegex} />);
    case '[]':
      return (<AnyOne id={id} onChangeedRegex={this.handleChangeRegex} />);
    default:
      console.log('default');
    }
  }

  getSelectors() {
    const list = this.state.items.map((item) => (
      <li className="selectable-meta">
        <div>
          <select id={item.id} onChange={this.handleSelectChange}>
            <option value="Text">Text</option>
            <option value="[]">[]</option>
            <option value=".">.</option>
            <option value="^">^</option>
            <option value="$">$</option>
          </select>
        </div>
        {this.getMetaCharacter(item.id)}
      </li>
    ));
    return (
      <ul>
        {list}
      </ul>
    );
  }

  render() {
    const selectors = this.getSelectors();
    return (
      <div className="selectable-regex">
        {selectors}
        <button onClick={this.handleClickAddButton}>Add Regex</button>
      </div>
    );
  }
}

SelectableRegex.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.numbser,
    type: PropTypes.string,
    meta: PropTypes.string
  })),
  regex: PropTypes.string
};
