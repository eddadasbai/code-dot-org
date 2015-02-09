var xml = require('./xml');
var savedAmd;

// Do some hackery to make it so that lodash doesn't think it's being loaded
// via require js
if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
  savedAmd = define.amd;
  define.amd = false;
}

// get lodash
var _ = require('./lodash');
var Hammer = require('./hammer');

// undo hackery
if (typeof define == 'function' && savedAmd) {
  define.amd = savedAmd;
  savedAmd = null;
}

exports.getLodash = function () {
  return _;
};

exports.getHammer = function () {
  return Hammer;
};

exports.shallowCopy = function(source) {
  var result = {};
  for (var prop in source) {
    result[prop] = source[prop];
  }

  return result;
};

/**
 * Returns a clone of the object, stripping any functions on it.
 */
exports.cloneWithoutFunctions = function(object) {
  return JSON.parse(JSON.stringify(object));
};

/**
 * Returns a new object with the properties from defaults overriden by any
 * properties in options. Leaves defaults and options unchanged.
 */
exports.extend = function(defaults, options) {
  var finalOptions = exports.shallowCopy(defaults);
  for (var prop in options) {
    finalOptions[prop] = options[prop];
  }

  return finalOptions;
};

exports.escapeHtml = function(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Version of modulo which, unlike javascript's `%` operator,
 * will always return a positive remainder.
 * @param number
 * @param mod
 */
exports.mod = function(number, mod) {
  return ((number % mod) + mod) % mod;
};

/**
 * Generates an array of integers from start to end inclusive
 */
exports.range = function(start, end) {
  var ints = [];
  for (var i = start; i <= end; i++) {
    ints.push(i);
  }
  return ints;
};

/**
 * Given two functions, generates a function that returns the result of the
 * second function if and only if the first function returns true
 */
exports.executeIfConditional = function (conditional, fn) {
  return function () {
    if (conditional()) {
      return fn.apply(this, arguments);
    }
  };
};

/**
 * Removes all single and double quotes from a string
 * @param inputString
 * @returns {string} string without quotes
 */
exports.stripQuotes = function(inputString) {
  return inputString.replace(/["']/g, "");
};

/**
 * Defines an inheritance relationship between parent class and this class.
 */
Function.prototype.inherits = function (parent) {
  this.prototype = _.create(parent.prototype, { constructor: parent });
};

/**
 * Wrap a couple of our Blockly number validators to allow for ???.  This is
 * done so that level builders can specify required blocks with wildcard fields.
 */
exports.wrapNumberValidatorsForLevelBuilder = function () {
  var nonNeg = Blockly.FieldTextInput.nonnegativeIntegerValidator;
  var numVal = Blockly.FieldTextInput.numberValidator;

  Blockly.FieldTextInput.nonnegativeIntegerValidator = function (text) {
    if (text === '???') {
      return text;
    }
    return nonNeg(text);
  };

  Blockly.FieldTextInput.numberValidator = function (text) {
    if (text === '???') {
      return text;
    }
    return numVal(text);
  };
};

function mergeFunctionsWithConfig(codeFunctions, dropletConfig) {
  var merged = [];

  if (codeFunctions instanceof Array) {
    // codeFunctions is in an array, use those exactly:
    merged = codeFunctions;
  } else if (codeFunctions instanceof Object &&
             dropletConfig &&
             dropletConfig.blocks) {
    var dropletBlocks = dropletConfig.blocks;
    // codeFunctions is an object with named key/value pairs
    //  key is a block name from dropletBlocks
    //  value is an object that can be used to override block defaults
    for (var i = 0; i < dropletBlocks.length; i++) {
      var block = dropletBlocks[i];
      if (dropletBlocks[i].func in codeFunctions) {
        // We found this particular block, now override the defaults with extend
        merged.push(exports.extend(dropletBlocks[i],
                    codeFunctions[dropletBlocks[i].func]));
      }
    }
  }
  return merged;
}

/**
 * Generate code aliases in Javascript based on some level data.
 */
exports.generateCodeAliases = function (codeFunctions, dropletConfig, parentObjName) {
  var code = '';
  var aliasFunctions;
  if (codeFunctions instanceof Array) {
    // codeFunctions is in an array, use those exactly:
    aliasFunctions = codeFunctions;
  } else if (dropletConfig && dropletConfig.blocks) {
    // use dropletConfig.blocks in its entirety (creating aliases for all
    // functions available in this app, even those not in this level's palette)
    aliasFunctions = dropletConfig.blocks;
  }

  // Insert aliases from aliasFunctions into code
  for (var i = 0; i < aliasFunctions.length; i++) {
    var cf = aliasFunctions[i];
    code += "var " + cf.func + " = function() { ";
    if (cf.idArgNone) {
      code += "return " + parentObjName + "." + cf.func + ".apply(" +
              parentObjName + ", arguments); };\n";
    } else {
      code += "var newArgs = " +
        (cf.idArgLast ? "arguments.concat(['']);" : "[''].concat(arguments);") +
        " return " + parentObjName + "." + cf.func +
        ".apply(" + parentObjName + ", newArgs); };\n";
    }
  }
  return code;
};

/**
 * Generate a palette for the droplet editor based on some level data.
 */
exports.generateDropletPalette = function (codeFunctions, dropletConfig) {
  // TODO: figure out localization for droplet scenario
  var stdPalette = [
    {
      name: 'Control',
      color: 'orange',
      blocks: [
        {
          block: 'for (var i = 0; i < 4; i++) {\n  __;\n}',
          title: 'Do something multiple times'
        }, {
          block: 'if (__) {\n  __;\n}',
          title: 'Do something only if a condition is true'
        }, {
          block: 'if (__) {\n  __;\n} else {\n  __;\n}',
          title: 'Do something if a condition is true, otherwise do something else'
        }, {
          block: 'while (__) {\n  __;\n}',
          title: 'Repeat something while a condition is true'
        }
      ]
    }, {
      name: 'Math',
      color: 'green',
      blocks: [
        {
          block: '__ + __',
          title: 'Add two numbers'
        }, {
          block: '__ - __',
          title: 'Subtract two numbers'
        }, {
          block: '__ * __',
          title: 'Multiply two numbers'
        }, {
          block: '__ / __',
          title: 'Divide two numbers'
        }, {
          block: '__ === __',
          title: 'Compare two numbers'
        }, {
          block: '__ > __',
          title: 'Compare two numbers'
        }, {
          block: '__ < __',
          title: 'Compare two numbers'
        }, {
          block: 'random()',
          title: 'Get a random number between 0 and 1'
        }, {
          block: 'round(__)',
          title: 'Round to the nearest integer'
        }, {
          block: 'abs(__)',
          title: 'Absolute value'
        }, {
          block: 'max(__, __)',
          title: 'Maximum value'
        }, {
          block: 'min(__, __)',
          title: 'Minimum value'
        }
      ]
    }, {
      name: 'Variables',
      color: 'blue',
      blocks: [
        {
          block: 'var x = __;',
          title: 'Create a variable for the first time'
        }, {
          block: 'x = __;',
          title: 'Reassign a variable'
        }, {
          block: 'var x = [1, 2, 3, 4];',
          title: 'Create a variable and initialize it as an array'
        }
      ]
    }, {
      name: 'Functions',
      color: 'violet',
      blocks: [
        {
          block: 'function myFunction() {\n  __;\n}',
          title: 'Create a function without an argument'
        }, {
          block: 'function myFunction(n) {\n  __;\n}',
          title: 'Create a function with an argument'
        }, {
          block: 'myFunction()',
          title: 'Use a function without an argument'
        }, {
          block: 'myFunction(n)',
          title: 'Use a function with argument'
        }
      ]
    }
  ];

  var defCategoryInfo = {
    'Actions': {
      'color': 'blue',
      'blocks': []
    }
  };
  categoryInfo = (dropletConfig && dropletConfig.categories) || defCategoryInfo;

  var mergedFunctions = mergeFunctionsWithConfig(codeFunctions, dropletConfig);
  var i, j;

  for (i = 0; i < mergedFunctions.length; i++) {
    var cf = mergedFunctions[i];
    var block = cf.func + "(";
    if (cf.params) {
      for (j = 0; j < cf.params.length; j++) {
        if (j !== 0) {
          block += ", ";
        }
        block += cf.params[j];
      }
    }
    block += ")";
    var blockPair = {
      block: block,
      title: cf.title || cf.func
    };
    categoryInfo[cf.category || 'Actions'].blocks.push(blockPair);
  }

  var addedPalette = [];
  for (var category in categoryInfo) {
    categoryInfo[category].name = category;
    for (j = 0; j < stdPalette.length; j++) {
      if (stdPalette[j].name === category) {
        // This category is in the stdPalette, merge in its blocks:
        categoryInfo[category].blocks =
            categoryInfo[category].blocks.concat(stdPalette[j].blocks);
        break;
      }
    }
    if (categoryInfo[category].blocks.length > 0) {
      addedPalette.push(categoryInfo[category]);
    }
  }

  for (j = 0; j < stdPalette.length; j++) {
    if (!(stdPalette[j].name in categoryInfo)) {
      // This category from the stdPalette hasn't been referenced yet, add it:
      addedPalette.push(stdPalette[j]);
    }
  }
  return addedPalette;
};

/**
 * Generate an Ace editor completer for a set of APIs based on some level data.
 */
exports.generateAceApiCompleter = function (codeFunctions, dropletConfig) {
  var apis = [];

  var completerFunctions;
  if (codeFunctions instanceof Array) {
    // codeFunctions is in an array, use those exactly:
    completerFunctions = codeFunctions;
  } else if (dropletConfig && dropletConfig.blocks) {
    // use dropletConfig.blocks in its entirety (completer will include all
    // functions available in this app, even those not in this level's palette)
    completerFunctions = dropletConfig.blocks;
  }

  for (var i = 0; i < completerFunctions.length; i++) {
    var cf = completerFunctions[i];
    apis.push({
      name: 'api',
      value: cf.func,
      meta: cf.category
    });
  }

  return {
    getCompletions: function(editor, session, pos, prefix, callback) {
      if (prefix.length === 0) {
        callback(null, []);
        return;
      }
      callback(null, apis);
    }
  };
};

/**
 * Generate modeOptions for the droplet editor based on some level data.
 */
exports.generateDropletModeOptions = function (codeFunctions, dropletConfig) {
  var modeOptions = {
    blockFunctions: [],
    valueFunctions: ['random', 'round', 'abs', 'max', 'min'],
    eitherFunctions: [],
  };

  // BLOCK, VALUE, and EITHER functions that are normally used in droplet
  // are included here in comments for reference. When we return our own
  // modeOptions from this function, it overrides and replaces the list below.
/*
  BLOCK_FUNCTIONS = ['fd', 'bk', 'rt', 'lt', 'slide', 'movexy', 'moveto', 'jump', 'jumpto', 'turnto', 'home', 'pen', 'fill', 'dot', 'box', 'mirror', 'twist', 'scale', 'pause', 'st', 'ht', 'cs', 'cg', 'ct', 'pu', 'pd', 'pe', 'pf', 'play', 'tone', 'silence', 'speed', 'wear', 'write', 'drawon', 'label', 'reload', 'see', 'sync', 'send', 'recv', 'click', 'mousemove', 'mouseup', 'mousedown', 'keyup', 'keydown', 'keypress', 'alert'];
  VALUE_FUNCTIONS = ['abs', 'acos', 'asin', 'atan', 'atan2', 'cos', 'sin', 'tan', 'ceil', 'floor', 'round', 'exp', 'ln', 'log10', 'pow', 'sqrt', 'max', 'min', 'random', 'pagexy', 'getxy', 'direction', 'distance', 'shown', 'hidden', 'inside', 'touches', 'within', 'notwithin', 'nearest', 'pressed', 'canvas', 'hsl', 'hsla', 'rgb', 'rgba', 'cell'];
  EITHER_FUNCTIONS = ['button', 'read', 'readstr', 'readnum', 'table', 'append', 'finish', 'loadscript'];
*/

  var mergedFunctions = mergeFunctionsWithConfig(codeFunctions, dropletConfig);
  for (var i = 0; i < mergedFunctions.length; i++) {
    if (mergedFunctions[i].type === 'value') {
      modeOptions.valueFunctions.push(mergedFunctions[i].func);
    }
    else if (mergedFunctions[i].type === 'either') {
      modeOptions.eitherFunctions.push(mergedFunctions[i].func);
    }
    else if (mergedFunctions[i].type !== 'hidden') {
      modeOptions.blockFunctions.push(mergedFunctions[i].func);
    }
  }

  return modeOptions;
};
