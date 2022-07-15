export interface IContext {
    request: IRequestContext;
}
export interface IRequestContext {
    getId(): string;
    getName(): string;
    getUrl(): string;
    setUrl(url: string): void;
    getMethod(): string;
    setMethod(method: string): void;
    getHeaders(): INameValue[];
    getHeader(name: string): string | null;
    hasHeader(name: string): boolean;
    removeHeader(name: string): void;
    setHeader(name: string, value: string): void;
    addHeader(name: string, value: string): void;
    getParameter(name: string): string | null;
    getParameters(): INameValue[];
    setParameter(name: string, value: string): void;
    hasParameter(name: string): boolean;
    addParameter(name: string, value: string): void;
    removeParameter(name: string): void;
    getBody(): IRequestBody;
    setBody(body: IRequestBody): void;
    getEnvironmentVariable(name: string): any;
    getEnvironment(): Object;
    setAuthenticationParameter(name: string, value: string): void;
    getAuthentication(): Object;
    setCookie(name: string, value: string): void;
    settingSendCookies(enabled: boolean): void;
    settingStoreCookies(enabled: boolean): void;
    settingEncodeUrl(enabled: boolean): void;
    settingDisableRenderRequestBody(enabled: boolean): void;
    settingFollowRedirects(enabled: boolean): void;
}
export interface IRequestBody {
    mimeType?: string;
    text?: string;
    fileName?: string;
    params?: IRequestBodyParameter[];
}
export interface IRequestBodyParameter extends INameValue {
    description?: string;
    disabled?: boolean;
    multiline?: string;
    id?: string;
    fileName?: string;
    type?: string;
}
export interface INameValue {
    name: string;
    value: string;
}
