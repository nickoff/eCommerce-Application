import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { InputType } from '@shared/enums';
import EyeIcon from './assets/eye-fill.svg';
import EyeSlashIcon from './assets/eye-slash-fill.svg';
import * as s from './visibility-toggle.module.scss';
import { IVisibilityToggleProps } from './visibility-toggle.interface';

export default class VisibilityToggle extends Component<IVisibilityToggleProps> {
  render(): JSX.Element {
    return (
      <span className={s.toggle} onclick={this.toggle.bind(this)}>
        {this.props.isVisible ? EyeSlashIcon.cloneNode(true) : EyeIcon.cloneNode(true)}
      </span>
    );
  }

  private toggle(): void {
    const { input } = this.props;
    input.type = input.type === InputType.Text ? InputType.Password : InputType.Text;
    this.setProps({ isVisible: !this.getState().isVisible });
  }
}
