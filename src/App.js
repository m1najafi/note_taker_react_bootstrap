import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table'
import FormFile from 'react-bootstrap/FormFile'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { FaPlusSquare } from 'react-icons/fa';
import {IconContext} from "react-icons"
import Collapse from 'react-bootstrap/Collapse'

class ContactRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.contact.Note}</td>
        <td>{this.props.contact.timestamp}</td>
      </tr>
    );
  }
}

class ContactTable extends React.Component {
  convert_time(contact) {
    return {timestamp:(new Date(contact.timestamp*1000).toLocaleDateString("en-US")), Note:contact.Note}
  }
  render() {
    var rows = [];
    this.props.contacts.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1).forEach((contact) => {
      rows.push(<ContactRow contact={this.convert_time(contact)} />);
    });
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Note</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  }
}

export default class FormExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_notes: [],
      note: '',
      open: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNotes = this.getNotes.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {note} = this.state;
    await axios.post(
      'https://ahidfnv1wk.execute-api.us-west-2.amazonaws.com/prod/SaveNotes/', {
      'note_text': note}
    ).then((response) => {
      this.getNotes(event);
      this.setState({open: false})
      console.log(response);
}, (error) => {
  console.log(error);
});
  }

  async getNotes(event) {
    if (event){
      event.preventDefault();
    }
    await axios.get(
      'https://ahidfnv1wk.execute-api.us-west-2.amazonaws.com/prod/SaveNotes/'
    ).then((response) => {
  console.log(response);
  this.setState({['all_notes'] : response.data});
}, (error) => {
  console.log(error);
});
  }

  componentDidMount(event) {
    this.getNotes();
  }

  render() {
    return (
      <Container>
        <Button
            variant="secondary"
            onClick={() => this.setState({open: !this.state.open})}
            aria-controls="example-collapse-text"
            aria-expanded={this.state.open}
          >
            <FaPlusSquare/>
          </Button>
          <Collapse in={this.state.open}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicText">
                <Form.Control
                  type="text"
                  onChange={(event) => this.setState({note: event.target.value})}
                  value={this.state.note}
                  placeholder="Enter your note" />
              </Form.Group>
            <Button variant="secondary" type="submit" size="lg">
              Save
            </Button>
          </Form>
        </Collapse>
        <ContactTable
          contacts={this.state.all_notes}
        />
      </Container>
    );
  }
}
