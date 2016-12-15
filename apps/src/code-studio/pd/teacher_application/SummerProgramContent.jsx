import React, {PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';

import {ButtonList} from '../form_components/button_list.jsx';
import {group2OrGroup1CsdWorkshops} from './applicationConstants';
export default React.createClass({

  displayName: 'SummerProgramContent',
  propTypes: {
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.shape({
      committedToSummer: PropTypes.string,
      ableToAttendAssignedSummerWorkshop: PropTypes.string,
      fallbackSummerWorkshops: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    errorData: PropTypes.shape({
      committedToSummer: PropTypes.string,
      ableToAttendAssignedSummerWorkshop: PropTypes.string,
      fallbackSummerWorkshops: PropTypes.string
    }).isRequired,
    selectedWorkshop: PropTypes.string
  },

  getInitialState() {
    return {
      dialogWasDismissed: false,
    };
  },

  checkListChange(event) {
    const selectedButtons = $(`[name=${event.target.name}]:checked`).map( (index, element) => element.value).toArray();
    this.props.onChange({[event.target.name]: selectedButtons});
  },

  radioButtonListChange(event) {
    this.props.onChange({[event.target.name]: event.target.value});
  },

  dismissDialog() {
    this.setState({dialogWasDismissed: true});
  },

  cancelApplication() {
    window.location.href = '/pd/teacher_application/thanks';
  },

  render() {
    console.log(this.props.formData);
    const showDialog = !!(this.props.formData.committedToSummer && this.props.formData.committedToSummer !== 'Yes' && !this.state.dialogWasDismissed);

    return (
      <div id="summerProgramContent">
        <div style={{fontWeight: 'bold'}}>
          As a reminder, teachers in this program are required to participate in:
          <li>
            One five-day summer workshop in 2017
          </li>
          <li>
            Four one-day local workshops during the 2017 - 18 school year (typically held on Saturdays)
          </li>
          <li>
            20 hours of online professional development during the 2017 - 18 school year
          </li>
          <ButtonList
            type="radio"
            label="Are you committed to participating in the entire program?"
            groupName="committedToSummer"
            answers={['Yes', 'No']}
            includeOther
            onChange={this.radioButtonListChange}
            selectedItems={this.props.formData.committedToSummer}
            required
            errorText={this.props.errorData.committedToSummer}
          />
          <Modal show={showDialog} onHide={this.dismissDialog} style={{width: 560}}>
            <Modal.Body>
              We are currently only able to offer spaces to applicants who are able to participate in the entire
              professional learning program. Please note that if you would like to continue this application in case
              your availability changes, we will add you to our waitlist and consider your application at the end of
              our review period.
              <br />
              <br />
              Would you like to continue your application?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.dismissDialog} bsStyle="primary">
                Yes, Continue Application
              </Button>
              <Button onClick={this.cancelApplication}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
          <label>
            We strongly encourage participants to attend their assigned summer workshop (based on the district in which
            you currently teach), so that you can meet the other teachers, facilitators and Regional Partners with whom
            you will work in 2017 - 18. Your regions and summer workshop dates are below.
          </label>
          <label style={{margin: '5px 0px 10px 15px', fontSize: '18px'}}>
            {this.props.selectedWorkshop}
          </label>
          <ButtonList
            type="radio"
            label="Are you able to attend your assigned summer workshop?"
            groupName="ableToAttendAssignedSummerWorkshop"
            answers={['Yes', 'No']}
            includeOther
            onChange={this.radioButtonListChange}
            selectedItems={this.props.formData.ableToAttendAssignedSummerWorkshop}
            required
            errorText={this.props.errorData.ableToAttendAssignedSummerWorkshop}
          />
          {
            this.props.formData.ableToAttendAssignedSummerWorkshop === 'No' && (
              <ButtonList
                type="check"
                label="If you are not able to attend your assigned summer workshop, which of the following workshops
                  are you available to attend? Please note that we are not able to guarantee a space for you in a
                  different location."
                groupName="fallbackSummerWorkshops"
                answers={Object.keys(group2OrGroup1CsdWorkshops)}
                onChange={this.checkListChange}
                selectedItems={this.props.formData.fallbackSummerWorkshops}
                required
                errorText={this.props.errorData.fallbackSummerWorkshops}
              />
            )
          }
        </div>
      </div>
    );
  }
});
