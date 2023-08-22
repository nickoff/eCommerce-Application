import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { type Customer } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import { IPasswordFlowError } from '@shared/interfaces';

export type FormControlType = Select | Input;

export type ApiRoot = ByProjectKeyRequestBuilder;

export type AuthResult = Customer | HttpErrorType | IPasswordFlowError;
