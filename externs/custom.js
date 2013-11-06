
/** @typedef {Object} */
var console = {

  /**
   * @param  {...*} args
   */
  log: function(args) {

  }
};

var ui;

ui.newPanel = null;
ui.newTab = null;

var i18n = {};

/**
 * Translate
 * @param  {string} symbol
 * @param  {Object=} args
 * @return {string}        translated string
 */
function t (symbol, args) {};

var Turbolinks = {
    visit: function () {}
}

/**
 * @param {...*} var_args
 */
jQuery.prototype.accordion = function (var_args) {};

/**
 * @param {...*} var_args
 */
jQuery.prototype.fileupload = function(var_args) {};

/**
 * @param {...*} var_args
 */
jQuery.prototype.autocomplete = function(var_args) {};

/**
 * @typedef {jquery_ui_autocomplete_options}
 */
var jquery_ui_autocomplete_options = {
  appendTo: '',
  autoFocus: '',
  delay: '',
  disabled: '',
  minLength: '',
  position: '',
  source: [],
  select: function () { },
  focus: function () { },
  menu: {
    active: false
  },
  multiple: false,
  remote: false
};

/**
 * @typedef {jquery_ui_button}
 */
var jquery_ui_button = {
  text: '',
  'class': '',
  click: function () {}
};

$.ui = {};

$.ui.keyCode = {
  "BACKSPACE":8,
  "COMMA":188,
  "DELETE":46,
  "DOWN":40,
  "END":35,
  "ENTER":13,
  "ESCAPE":27,
  "HOME":36,
  "LEFT":37,
  "NUMPAD_ADD":107,
  "NUMPAD_DECIMAL":110,
  "NUMPAD_DIVIDE":111,
  "NUMPAD_ENTER":108,
  "NUMPAD_MULTIPLY":106,
  "NUMPAD_SUBTRACT":109,
  "PAGE_DOWN":34,
  "PAGE_UP":33,
  "PERIOD":190,
  "RIGHT":39,
  "SPACE":32,
  "TAB":9,
  "UP":38
};


$.ui.autocomplete = {
  filter: function (data, fnc) { }
};

/**
 * @typedef {{term: string}}
 */
var jquery_ui_autocomplete_request = {
  term: ''
}

/**
 *
 * @typedef {{id: (string|number|undefined),
 *          thumbnail: (string|undefined),
 *          url: string,
 *          caption: (string|undefined),
 *          alt: string}}
 */
var images_dialog_object = {
  id: '',
  thumbnail: '',
  url: '',
  caption: '',
  alt: ''
};

/**
 *
 * @typedef {{id: string,
 *          alt: string,
 *          caption: (string|undefined),
 *          geometry: (string|undefined),
 *          size: string,
 *          sizes: Object}}
 */
var image_dialog_object = {
  id: '',
  alt: '',
  caption: '',
  geometry: '',
  size: '',
  sizes: {}
};

/**
 *
 * @typedef {{id: number, name: string, size: number, url: string, ext: string, mime_type: string}}
 */
var file_dialog_object = {
  id: 0,
  name: '',
  size: '',
  url: '',
  ext: '',
  mime_type: ''
};


/**
 *
 * @typedef {{url: string,
 *          html: (string|undefined),
 *          blank: (boolean|undefined),
 *          type: string,
 *          title: string}}
 */
var links_dialog_object = {
  url: '',
  blank: false,
  type: '',
  title: ''
};

/**
 *
 * @typedef {{html: Array,
 *          redirect_to: string,
 *          image: Object,
 *          file: Object,
 *          message: (Object|string|null)}}
 */
var json_response = {
  html: [],
  message: '',
  redirect_to: '',
  image: {},
  file: {}
};

/**
 * @typedef {{image_id: (number|string), buttons: (undefined|Array)}}
 */
var image_dialog_options = {
    image_id: '',
    buttons: []
};

/**
 * @typedef  {{name: string, title: string, active: boolean}}
 */
var page_part = {
    name: '',
    title: '',
    active: false,
    id: '',
    position: ''
};


$.rails = {
  /**
   * @param {jQuery} element
   */
  handleRemote: function (element) {}
};
