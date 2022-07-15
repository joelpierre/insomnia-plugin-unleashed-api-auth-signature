import * as crypto from 'crypto';

const settings = { key: '' };

interface IQueryParam {
  name: string;
  value: string;
}

const queryParamsToString = (params: IQueryParam[] = []) => {
  return params.reduce((acc, { name, value }) => {
    if (!name || !value) {
      return acc;
    }
    return `${acc || ''}${acc ? '&' : ''}${name}=${value}`;
  }, '');
};

function createSignature(queryParams) {
  return crypto
    .createHmac('sha256', settings.key)
    .update(queryParams, 'utf8')
    .digest('base64');
}

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
        settings.key = key;
        return createSignature(
          queryParamsToString(queryParams ? JSON.parse(queryParams) : [])
        );
      },
    },
  ],
  requestHooks: [
    (context) => {
      context.request.setHeader(
        'api-auth-signature',
        createSignature(
          queryParamsToString(context.request.getParameters() || [])
        )
      );
    },
  ],
};
