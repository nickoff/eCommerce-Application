import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export type FormControlType = Select | Input;
export type ApiRoot = ByProjectKeyRequestBuilder;
