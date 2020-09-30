"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _base = _interopRequireDefault(require("./_base.mask"));

var _vanillaMasker = _interopRequireDefault(require("../internal-dependencies/vanilla-masker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MONEY_MASK_SETTINGS = {
  precision: 2,
  separator: ',',
  delimiter: '.',
  unit: 'R$',
  suffixUnit: ''
};

class MoneyMask extends _base.default {
  static getType() {
    return 'money';
  }

  getValue(value, settings) {
    const mergedSettings = super.mergeSettings(MONEY_MASK_SETTINGS, settings);
    const raw = this.getRawValueForMask(value, mergedSettings); // empty content should return empty string

    if (raw === '') {
      return '';
    }

    return _vanillaMasker.default.toMoney(raw, mergedSettings);
  }

  handleBlur(maskedValue, settings) {
    const opts = super.mergeSettings(MONEY_MASK_SETTINGS, settings);
    const includeSuffix = opts.suffixUnit ? opts.suffixUnit : '';
    let {
      maskedText,
      rawText
    } = this.handleFocus(maskedValue, settings);
    maskedText = "".concat(maskedText).concat(includeSuffix);
    return {
      maskedText,
      rawText
    };
  }

  handleFocus(maskedValue, settings) {
    if (typeof maskedValue === 'number') {
      return {
        maskedText: maskedValue,
        rawText: maskedValue
      };
    }

    const opts = super.mergeSettings(MONEY_MASK_SETTINGS, settings);
    const rawValue = this.getRawValue(maskedValue, opts);
    return {
      maskedText: maskedValue.replace(opts.suffixUnit, ''),
      rawText: rawValue
    };
  }

  normalizeValue(maskedValue, settings) {
    if (typeof maskedValue === 'number') {
      return maskedValue;
    }

    const mergedSettings = super.mergeSettings(MONEY_MASK_SETTINGS, settings);
    const cleaned = super.removeNotNumbersForMoney(maskedValue).toString().split(mergedSettings.separator); // if seperator and delimeter are the same we cannot use the way we did before
    // this should not happen but if happens for some reason we will try to find decimals

    if (mergedSettings.separator === mergedSettings.delimiter) {
      if (cleaned.length === 1) {
        return cleaned[0];
      }

      const lastPart = cleaned.pop();
      const isLastPartDecimal = lastPart.length <= mergedSettings.precision;
      return cleaned.join('') + (isLastPartDecimal ? '.' + lastPart : lastPart);
    }

    return cleaned.join('').replace(mergedSettings.delimiter, '.');
  }

  getRawValueForMask(maskedValue, settings) {
    const normalized = this.normalizeValue(maskedValue, settings);

    if (normalized === '') {
      return '';
    }

    return normalized;
  }

  getRawValue(maskedValue, settings) {
    const mergedSettings = super.mergeSettings(MONEY_MASK_SETTINGS, settings);
    const normalized = this.normalizeValue(maskedValue, mergedSettings);
    return Number(normalized);
  }

  validate(value, settings) {
    return true;
  }

  _sanitize(value, settings) {
    if (typeof value === 'number') {
      return value.toFixed(settings.precision);
    }

    return value;
  }

  _insert(text, index, string) {
    if (index > 0) {
      return text.substring(0, index) + string + text.substring(index, text.length);
    } else {
      return string + text;
    }
  }

}

exports.default = MoneyMask;
//# sourceMappingURL=money.mask.js.map