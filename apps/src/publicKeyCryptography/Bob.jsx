/** @file The Bob character panel from the crypto widget */
import React from 'react';
import CollapsiblePanel from './CollapsiblePanel';
import NumberedSteps from './NumberedSteps';
import IntegerField from './IntegerField';
import IntegerTextbox from './IntegerTextbox';
import {PublicModulusDropdown, SecretNumberDropdown} from './cryptographyFields';

const Bob = React.createClass({
  propTypes: {
    setPublicModulus: React.PropTypes.func.isRequired,
    setPublicNumber: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      publicModulus: null,
      publicKey: null,
      secretNumber: null,
    };
  },

  setPublicModulus(publicModulus) {
    this.setState({publicModulus});
    this.setSecretNumber(null);
  },

  onPublicModulusChange(publicModulus) {
    this.setPublicModulus(publicModulus);
    this.props.setPublicModulus(publicModulus);
  },

  setPublicKey(publicKey) {
    this.setState({publicKey});
  },

  setSecretNumber(secretNumber) {
    const {publicKey, publicModulus} = this.state;
    this.setState({secretNumber});
    this.props.setPublicNumber(this.publicNumber({publicKey, secretNumber, publicModulus}));
  },

  publicNumber({publicKey, secretNumber, publicModulus}) {
    return publicKey && secretNumber && publicModulus ?
        ((publicKey * secretNumber) % publicModulus) :
        null;
  },

  render() {
    const {
      publicModulus,
      publicKey,
      secretNumber
    } = this.state;
    const publicNumber = this.publicNumber(this.state);
    return (
      <CollapsiblePanel title="Bob">
        <NumberedSteps>
          <div>
            Enter public modulus: <PublicModulusDropdown value={publicModulus} onChange={this.onPublicModulusChange}/>
          </div>
          <div>
            Enter Alice's public key: <IntegerTextbox value={publicKey} onChange={this.setPublicKey}/>
          </div>
          <div>
            Pick your secret number: <SecretNumberDropdown value={secretNumber} onChange={this.setSecretNumber} publicModulus={publicModulus}/>
          </div>
          <div>
            Calculate your public number:
            <div>
              (<IntegerField value={publicKey}/> x <IntegerField value={secretNumber}/>)MOD <IntegerField value={publicModulus}/> <button>Go</button>
            </div>
            <div>
              Your computed public number is <IntegerField value={publicNumber}/>
            </div>
          </div>
        </NumberedSteps>
      </CollapsiblePanel>);
  }
});
export default Bob;
