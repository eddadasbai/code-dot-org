import {expect} from '../../util/configuredChai';
import {themeOptions, DEFAULT_THEME_INDEX} from '@cdo/apps/applab/constants';
import designMode from '@cdo/apps/applab/designMode';
import {getPrefixedElementById} from '@cdo/apps/applab/designElements/elementUtils';

describe('appendPx', () => {
  it('returns a valid css positive integer', function() {
    const cssVal = designMode.appendPx(100);
    expect(cssVal).to.equal('100px');
  });
  it('returns 0 as a valid value', function() {
    const cssVal = designMode.appendPx(0);
    expect(cssVal).to.equal('0px');
  });
  it('returns the given stringified integer as a valid value', function() {
    const cssVal = designMode.appendPx('100');
    expect(cssVal).to.equal('100px');
  });
  it('returns a value with px as a valid value', function() {
    const cssVal = designMode.appendPx('100px');
    expect(cssVal).to.equal('100px');
  });
  it('returns an empty string if given a string', function() {
    const cssVal = designMode.appendPx('one hundred');
    expect(cssVal).to.equal('');
  });
  it('returns an empty string if given an object', function() {
    const cssVal = designMode.appendPx({object: 100});
    expect(cssVal).to.equal('');
  });
  it('returns an empty string if given an array with first element as a string', function() {
    const cssVal = designMode.appendPx(['bark', 300, 400]);
    expect(cssVal).to.equal('');
  });
  it('returns an empty string if given an array with first element as a number', function() {
    const cssVal = designMode.appendPx([200, 300, 400]);
    expect(cssVal).to.equal('');
  });
  it('returns an empty string if empty', function() {
    const cssVal = designMode.appendPx();
    expect(cssVal).to.equal('');
  });
  it('returns an empty string if null', function() {
    const cssVal = designMode.appendPx(null);
    expect(cssVal).to.equal('');
  });
  it('returns an empty string if undefined', function() {
    const cssVal = designMode.appendPx(undefined);
    expect(cssVal).to.equal('');
  });
});

describe('makeUrlProtocolRelative', () => {
  const {makeUrlProtocolRelative} = designMode;

  it('does not change a url that is already protocol-relative', () => {
    [
      '//test.code.org',
      '//example.com/http://something-else',
      '//test-studio.code.org/media?u=http%3A%2F%2Fexample.com'
    ].forEach(originalUrl => {
      expect(makeUrlProtocolRelative(originalUrl)).to.equal(originalUrl);
    });
  });

  it('changes http:// to //', () => {
    [
      {
        input: 'http://test.code.org',
        expected: '//test.code.org'
      },
      {
        input: 'http://example.com/http://something-else',
        expected: '//example.com/http://something-else'
      },
      {
        input: 'http://test-studio.code.org/media?u=http%3A%2F%2Fexample.com',
        expected: '//test-studio.code.org/media?u=http%3A%2F%2Fexample.com'
      }
    ].forEach(({input, expected}) => {
      expect(makeUrlProtocolRelative(input)).to.equal(expected);
    });
  });

  it('changes https:// to //', () => {
    [
      {
        input: 'https://test.code.org',
        expected: '//test.code.org'
      },
      {
        input: 'https://example.com/http://something-else',
        expected: '//example.com/http://something-else'
      },
      {
        input: 'https://test-studio.code.org/media?u=http%3A%2F%2Fexample.com',
        expected: '//test-studio.code.org/media?u=http%3A%2F%2Fexample.com'
      }
    ].forEach(({input, expected}) => {
      expect(makeUrlProtocolRelative(input)).to.equal(expected);
    });
  });
});

describe('setProperty and read Property', () => {
  let picture, text_input, text_area, dropdown;
  // Create HTML elements to get/set
  beforeEach(() => {
    picture = document.createElement('img');
    text_input = document.createElement('input');
    text_area = document.createElement('div');
    dropdown = document.createElement('select');
    let option1 = document.createElement('option');
    option1.innerHTML = 'Eta Theta';
    let option2 = document.createElement('option');
    option2.innerHTML = 'Epsilon Zeta';
    dropdown.appendChild(option1);
    dropdown.appendChild(option2);
  });

  describe('setProperty: ', () => {
    it('Sets the expected text for dropdowns, text area, and text input', () => {
      designMode.updateProperty(text_input, 'text', 'Alpha Beta');
      designMode.updateProperty(text_area, 'text', 'Gamma Delta');
      designMode.updateProperty(dropdown, 'text', 'Epsilon Zeta');

      expect(text_input.value).to.equal('Alpha Beta');
      expect(text_area.innerHTML).to.equal('Gamma Delta');
      expect(dropdown.value).to.equal('Epsilon Zeta');
    });
    it('Sets the expected value for dropdowns, text area, and text input', () => {
      designMode.updateProperty(text_input, 'value', 'Iota Kappa');
      designMode.updateProperty(text_area, 'value', 'Lambda Mu');
      designMode.updateProperty(dropdown, 'value', 'Eta Theta');

      expect(text_input.value).to.equal('Iota Kappa');
      expect(text_area.innerHTML).to.equal('Lambda Mu');
      expect(dropdown.value).to.equal('Eta Theta');
    });
    it('Uses the asset timestamp in the source path for pictures', () => {
      designMode.updateProperty(picture, 'picture', 'picture.jpg', 123456);
      expect(picture.src).to.contain('picture.jpg?t=123456');
    });
  });

  describe('readProperty: ', () => {
    beforeEach(() => {
      text_input.value = 'Nu Xi';
      text_area.innerHTML = 'Omicron Pi';
      dropdown.value = 'Epsilon Zeta';
    });

    it('Gets the expected text for dropdowns, text area, and text input', () => {
      expect(designMode.readProperty(text_input, 'text')).to.equal('Nu Xi');
      expect(designMode.readProperty(text_area, 'text')).to.equal('Omicron Pi');
      expect(designMode.readProperty(dropdown, 'text')).to.equal(
        'Epsilon Zeta'
      );
    });
    it('Gets the expected value for dropdowns, text area, and text input', () => {
      expect(designMode.readProperty(text_input, 'value')).to.equal('Nu Xi');
      expect(designMode.readProperty(text_area, 'value')).to.equal(
        'Omicron Pi'
      );
      expect(designMode.readProperty(dropdown, 'value')).to.equal(
        'Epsilon Zeta'
      );
    });
  });

  describe('changeThemeForCurrentScreen: ', () => {
    let designModeViz;

    beforeEach(() => {
      designModeViz = document.createElement('div');
      designModeViz.id = 'designModeViz';
      document.body.appendChild(designModeViz);
    });

    afterEach(() => {
      designModeViz.parentNode.removeChild(designModeViz);
    });

    function setExistingHTML(existingHTML) {
      designModeViz.innerHTML = existingHTML;
    }

    it('will change a legacy screen without the data-theme attribute', () => {
      setExistingHTML(`
        <div class="screen" id="design_screen1">
        </div>
      `);

      // Change theme to watermelon, verify that the screen now has the data-theme attribute
      // and the background color for that theme:
      designMode.changeThemeForCurrentScreen(
        getPrefixedElementById('screen1'),
        'watermelon'
      );
      expect(getPrefixedElementById('screen1')).not.to.be.null;
      expect(
        getPrefixedElementById('screen1').getAttribute('data-theme')
      ).to.equal('watermelon');
      expect(getPrefixedElementById('screen1').style.backgroundColor).to.equal(
        'rgb(197, 226, 85)'
      );
    });

    it('will change a default theme screen', () => {
      setExistingHTML(`
        <div class="screen" id="design_screen1" data-theme="default" style="background-color: rgb(255, 255, 255);">
        </div>
      `);

      // Change theme to watermelon, verify that the screen now has an updated data-theme attribute
      // and the background color for that theme:
      designMode.changeThemeForCurrentScreen(
        getPrefixedElementById('screen1'),
        'watermelon'
      );
      expect(getPrefixedElementById('screen1')).not.to.be.null;
      expect(
        getPrefixedElementById('screen1').getAttribute('data-theme')
      ).to.equal('watermelon');
      expect(getPrefixedElementById('screen1').style.backgroundColor).to.equal(
        'rgb(197, 226, 85)'
      );
    });

    it('will change a child of a legacy screen without the data-theme attribute', () => {
      setExistingHTML(`
        <div class="screen" id="design_screen1">
          <input id="design_input1">
        </div>
      `);

      // Change theme to default, verify that the screen now has the data-theme attribute
      // and the textInput now has the padding style and the background color of the new theme:
      designMode.changeThemeForCurrentScreen(
        getPrefixedElementById('screen1'),
        themeOptions[DEFAULT_THEME_INDEX]
      );
      expect(getPrefixedElementById('screen1')).not.to.be.null;
      expect(
        getPrefixedElementById('screen1').getAttribute('data-theme')
      ).to.equal(themeOptions[DEFAULT_THEME_INDEX]);
      expect(getPrefixedElementById('input1')).not.to.be.null;
      expect(getPrefixedElementById('input1').style.padding).to.equal(
        '5px 15px'
      );
      expect(getPrefixedElementById('input1').style.backgroundColor).to.equal(
        'rgb(242, 242, 242)'
      );
    });

    it('will change a child of a default theme screen', () => {
      setExistingHTML(`
        <div class="screen" id="design_screen1" data-theme="default" style="background-color: rgb(255, 255, 255);">
          <input id="design_input1" style="margin: 0px; width: 200px; height: 30px; border-style: solid; background-color: rgb(242, 242, 242); border-radius: 4px; border-width: 1px; border-color: rgb(77, 87, 95); color: rgb(77, 87, 95); font-family: Arial, Helvetica, sans-serif; font-size: 13px; padding: 5px 15px; position: static; left: 25px; top: 25px;">
        </div>
      `);

      // Change theme to watermelon, verify that the screen now has an updated data-theme attribute
      // and the textInput now has the padding style and the background color of the new theme:
      designMode.changeThemeForCurrentScreen(
        getPrefixedElementById('screen1'),
        'watermelon'
      );
      expect(getPrefixedElementById('screen1')).not.to.be.null;
      expect(
        getPrefixedElementById('screen1').getAttribute('data-theme')
      ).to.equal('watermelon');
      expect(getPrefixedElementById('input1')).not.to.be.null;
      expect(getPrefixedElementById('input1').style.padding).to.equal(
        '5px 15px'
      );
      expect(getPrefixedElementById('input1').style.backgroundColor).to.equal(
        'rgb(226, 240, 170)'
      );
    });
  });
});
