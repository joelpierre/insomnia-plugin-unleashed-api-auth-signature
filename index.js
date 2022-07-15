var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define("src/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/index", ["require", "exports", "crypto"], function (require, exports, crypto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    crypto = __importStar(crypto);
    const AUTH_SIGNATURE_HEADER = 'api-auth-signature';
    const SETTINGS = { key: '' };
    const queryParamsToString = (params = []) => {
        return params.reduce((acc, { name, value }) => {
            if (!name || !value) {
                return acc;
            }
            return `${acc || ''}${acc ? '&' : ''}${name}=${value}`;
        }, '');
    };
    const createSignature = (queryParamsAsString) => {
        return crypto
            .createHmac('sha256', SETTINGS.key)
            .update(queryParamsAsString, 'utf8')
            .digest('base64');
    };
    module.exports = {
        templateTags: [
            {
                name: 'unleashedapiauthsig',
                displayName: 'Unleashed Api Signature',
                args: [
                    {
                        displayName: 'Key',
                        type: 'string',
                        placeholder: 'Unleashed API Key',
                    },
                    {
                        displayName: 'Query Params',
                        type: 'string',
                        placeholder: 'JSON stringified array of name=value pairs: [{"name": "foo", "value": "bar"}]',
                    },
                ],
                run: (context, key = '', queryParams = '') => {
                    SETTINGS.key = key;
                    return createSignature(queryParamsToString(queryParams ? JSON.parse(queryParams) : []));
                },
            },
        ],
        requestHooks: [
            (context) => {
                const hasSignatureHeader = context.request
                    .getHeaders()
                    .some((header) => header.name === AUTH_SIGNATURE_HEADER);
                if (hasSignatureHeader) {
                    context.request.setHeader(AUTH_SIGNATURE_HEADER, createSignature(queryParamsToString(context.request.getParameters() || [])));
                }
            },
        ],
    };
});
