import * as crypto from 'crypto';
import { IContext, INameValue } from './types';

const AUTH_SIGNATURE_HEADER = 'api-auth-signature';
const SETTINGS = { key: '' };

const queryParamsToString = (params: INameValue[] = []) => {
  return params.reduce((acc, { name, value }) => {
    if (!name || !value) {
      return acc;
    }
    return `${acc || ''}${acc ? '&' : ''}${name}=${value}`;
  }, '');
};

const createSignature = (queryParamsAsString: string) => {
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
          placeholder:
            'JSON stringified array of name=value pairs: [{"name": "foo", "value": "bar"}]',
        },
      ],
      run: (context, key = '', queryParams = '') => {
        SETTINGS.key = key;
        return createSignature(
          queryParamsToString(queryParams ? JSON.parse(queryParams) : [])
        );
      },
    },
  ],
  requestHooks: [
    (context: IContext) => {
      const hasSignatureHeader = context.request
        .getHeaders()
        .some((header) => header.name === AUTH_SIGNATURE_HEADER);

      if (hasSignatureHeader) {
        context.request.setHeader(
          AUTH_SIGNATURE_HEADER,
          createSignature(
            queryParamsToString(context.request.getParameters() || [])
          )
        );
      }
    },
  ],
};
