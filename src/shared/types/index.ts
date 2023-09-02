import { type Input } from '@components/shared/ui/input/input';
import type Select from '@components/shared/ui/select/select';
import { type ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { type Customer } from '@commercetools/platform-sdk';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { IPasswordFlowError } from '@shared/interfaces';

export type FormControlType = Select | Input;

export type ApiRoot = ByProjectKeyRequestBuilder;

export type AuthResult = Customer | HttpErrorType | IPasswordFlowError;
