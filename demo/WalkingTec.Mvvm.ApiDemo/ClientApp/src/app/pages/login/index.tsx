
import { Button, Form, Icon, Input, message, Row, Popconfirm } from 'antd';
import { DesForm } from 'components/decorators';
import lodash from 'lodash';
import Animate from 'rc-animate';
import * as React from 'react';
import store from 'store/index';
import ImgCode from './imgCode'
import './style.less';
import GlobalConfig from 'global.config';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
@DesForm
export default class LoginDemo extends React.Component<any, any>{
  state = {
    loading: false,
    notCode: true,
    visible: false
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.state.loading) {
      return
    }
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await store.User.Login(values);
        } catch (error) {
          message.destroy();
          message.error(lodash.get(error, 'Entity.login'))
          this.setState({ loading: false })
        }
      }
    });
  }
  onSuccess() {
    this.setState({ notCode: false })
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    try {
      this.props.form.validateFields();
    } catch (error) {

    }
  }
  render() {
    const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = this.props.form;
    const userNameError = isFieldTouched('userid') && getFieldError('userid');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const disabled = hasErrors(getFieldsError())
    return (
      <Animate transitionName="fade"
        transitionAppear={true} component="">
        <Row type="flex" justify="center" align="middle" className='app-login' >
          <Form onSubmit={this.onSubmit.bind(this)} className="app-login-form" >
            <h1>{GlobalConfig.default.title}</h1>
            <Form.Item
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
            >
              {getFieldDecorator('userid', {
                rules: [{ required: true, message: '请输入 用户名!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </Form.Item>
            <Form.Item
              validateStatus={passwordError ? 'error' : ''}
              help={passwordError || ''}
            >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入 密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Form.Item>
            <div
              onMouseEnter={e => {
                if (this.state.notCode && !disabled) {
                  this.setState({ visible: true })
                }
              }}
              onMouseOut={e => {
                if (!this.state.notCode) {
                  this.setState({ visible: false })
                }
              }}>
              <Form.Item >
                <Popconfirm
                  overlayClassName="app-login-imgcode"
                  placement="top"
                  title={<ImgCode onSuccess={this.onSuccess.bind(this)} key={String(this.state.notCode)} />}
                  trigger="hover"
                  visible={this.state.visible && this.state.notCode}
                  icon="" >
                  <Button

                    disabled={disabled || this.state.notCode}
                    type="primary" htmlType="submit" block
                    loading={this.state.loading}>
                    <span > Log in</span>
                  </Button>
                </Popconfirm>
              </Form.Item>
            </div>
          </Form>
        </Row>

      </Animate  >

    );
  }
}