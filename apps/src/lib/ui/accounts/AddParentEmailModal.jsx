import PropTypes from 'prop-types';
import React from 'react';
import i18n from '@cdo/locale';
import BaseDialog from '../../../templates/BaseDialog';
import color from '../../../util/color';
import {isEmail} from '../../../util/formatValidation';
import {Field, Header, ConfirmCancelFooter} from '../SystemDialog/SystemDialog';
import {pegasus} from '../../util/urlHelpers';

const STATE_INITIAL = 'initial';
const STATE_SAVING = 'saving';
const STATE_UNKNOWN_ERROR = 'unknown-error';

export default class AddParentEmailModal extends React.Component {
  static propTypes = {
    /**
     * @type {function({newEmail: string}):Promise}
     */
    handleSubmit: PropTypes.func.isRequired,
    /**
     * @type {function()}
     */
    handleCancel: PropTypes.func.isRequired
  };

  state = {
    saveState: STATE_INITIAL,
    values: {
      parentEmail: '',
      emailOptIn: ''
    },
    serverErrors: {
      parentEmail: '',
      emailOptIn: ''
    }
  };

  save = () => {
    // No-op if we know the form is invalid, client-side.
    // This blocks return-key submission when the form is invalid.
    if (!this.isFormValid(this.getValidationErrors())) {
      return;
    }

    const {values} = this.state;
    this.setState({saveState: STATE_SAVING});
    this.props.handleSubmit(values).catch(this.onSubmitFailure);
  };

  cancel = () => this.props.handleCancel();

  onSubmitFailure = error => {
    if (error && error.hasOwnProperty('serverErrors')) {
      this.setState(
        {
          saveState: STATE_INITIAL,
          serverErrors: error.serverErrors
        },
        () => this.changeEmailForm.focusOnAnError()
      );
    } else {
      this.setState({saveState: STATE_UNKNOWN_ERROR});
    }
  };

  isFormValid(validationErrors) {
    return Object.keys(validationErrors).every(key => !validationErrors[key]);
  }

  getValidationErrors() {
    const {serverErrors} = this.state;
    return {
      newEmail: serverErrors.newEmail || this.getNewEmailValidationError(),
      emailOptIn: serverErrors.emailOptIn || this.getEmailOptInValidationError()
    };
  }

  getNewEmailValidationError = () => {
    const {parentEmail} = this.state.values;
    if (parentEmail.trim().length === 0) {
      return i18n.changeEmailModal_newEmail_isRequired();
    }
    if (!isEmail(parentEmail.trim())) {
      return i18n.changeEmailModal_newEmail_invalid();
    }
    return null;
  };

  getEmailOptInValidationError = () => {
    const {emailOptIn} = this.state.values;
    if (emailOptIn.length === 0) {
      return i18n.addParentEmailModal_emailOptIn_isRequired();
    }
    return null;
  };

  onParentEmailChange = event => {
    const {values} = this.state;
    values['parentEmail'] = event.target.value;
    this.setState({values});
  };

  onEmailOptInChange = event => {
    const {values} = this.state;
    values['emailOptIn'] = event.target.value;
    this.setState({values});
  };

  render = () => {
    const {saveState, values} = this.state;
    const validationErrors = this.getValidationErrors();
    const isFormValid = this.isFormValid(validationErrors);
    return (
      <BaseDialog
        useUpdatedStyles
        isOpen
        handleClose={this.cancel}
        uncloseable={STATE_SAVING === saveState}
      >
        <div style={styles.container}>
          <Header text={i18n.addParentEmailModal_title()} />
          <Field
            label={i18n.addParentEmailModal_newEmail_label()}
            error={validationErrors.newEmail}
          >
            <input
              type="email"
              value={values.parentEmail}
              tabIndex="1"
              onKeyDown={this.onKeyDown}
              onChange={this.onParentEmailChange}
              autoComplete="off"
              maxLength="255"
              size="255"
              style={styles.input}
              ref={el => (this.newEmailInput = el)}
            />
          </Field>
          <Field error={validationErrors.emailOptIn}>
            <div style={styles.emailOptIn}>
              <label style={styles.label}>
                {i18n.addParentEmailModal_emailOptIn_description()}{' '}
                <a href={pegasus('/privacy')}>
                  {i18n.changeEmailModal_emailOptIn_privacyPolicy()}
                </a>
              </label>
              <div>
                <div style={styles.radioButton}>
                  <label style={styles.input}>
                    <input
                      type="radio"
                      value={'yes'}
                      checked={values['emailOptIn'] === 'yes'}
                      onChange={this.onEmailOptInChange}
                    />
                  </label>
                  <label style={styles.label}>{i18n.yes()}</label>
                </div>
                <div style={styles.radioButton}>
                  <label style={styles.input}>
                    <input
                      type="radio"
                      value={'no'}
                      checked={values['emailOptIn'] === 'no'}
                      onChange={this.onEmailOptInChange}
                    />
                  </label>
                  <label style={styles.label}>{i18n.no()}</label>
                </div>
              </div>
            </div>
          </Field>
          <ConfirmCancelFooter
            confirmText={i18n.addParentEmailModal_save()}
            onConfirm={this.save}
            onCancel={this.cancel}
            disableConfirm={STATE_SAVING === saveState || !isFormValid}
            disableCancel={STATE_SAVING === saveState}
            tabIndex="2"
          >
            {STATE_SAVING === saveState && <em>{i18n.saving()}</em>}
            {STATE_UNKNOWN_ERROR === saveState && (
              <em>{i18n.changeEmailModal_unexpectedError()}</em>
            )}
          </ConfirmCancelFooter>
        </div>
      </BaseDialog>
    );
  };
}

const styles = {
  container: {
    margin: 20,
    color: color.charcoal
  },
  input: {
    //marginBottom: 4
  },
  emailOptIn: {
    display: 'flex',
    flexDirection: 'row'
  },
  radioButton: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  label: {
    margin: 'auto'
  }
};
