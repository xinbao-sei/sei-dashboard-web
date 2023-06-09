/*
 * @Author: Eason
 * @Date: 2020-04-03 11:21:32
 * @Last Modified by: Eason
 * @Last Modified time: 2020-04-27 14:31:00
 */

import React, { PureComponent } from 'react';
import cls from 'classnames';
import { omit, get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, InputNumber } from 'antd';
import { ComboList } from 'suid';
import { getHashCode, constants } from '../../../../utils';
import styles from './Form.less';

const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class SceneForm extends PureComponent {
  handlerFormSubmit = () => {
    const { form, saveScene, editData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const data = {
        ...editData,
      };
      Object.assign(data, getFieldsValue());
      data.code = get(editData, 'code', '') || getHashCode();
      saveScene(
        omit(data, ['config', 'instanceDtos', 'widgetInstanceIds', 'sceneCategoryRemark']),
        handlerPopoverHide,
      );
    });
  };

  render() {
    const { form, editData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? formatMessage({id: 'dashboard_000039', defaultMessage: '编辑场景'}) : formatMessage({id: 'dashboard_000040', defaultMessage: '新建场景'});
    getFieldDecorator('sceneCategory', {
      initialValue: get(editData, 'sceneCategory', 'DASHBOARD'),
      rules: [
        {
          required: true,
        },
      ],
    });
    const sceneCategoryProps = {
      form,
      name: 'sceneCategoryRemark',
      field: ['sceneCategory'],
      store: {
        url: `${SERVER_PATH}/sei-dashboard/scene/getSceneCategoryEnum`,
      },
      reader: {
        name: 'remark',
        field: ['name'],
      },
    };
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">{title}</span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label={formatMessage({id: 'dashboard_000041', defaultMessage: '代码'})}>
              {getFieldDecorator('code', {
                initialValue: get(editData, 'code', ''),
                rules: [
                  {
                    required: false,
                    message: formatMessage({id: 'dashboard_000042', defaultMessage: '自动生成'}),
                  },
                ],
              })(<Input disabled placeholder={formatMessage({id: 'dashboard_000042', defaultMessage: '自动生成'})} autoComplete="off" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
              {getFieldDecorator('name', {
                initialValue: get(editData, 'name', ''),
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'global.name.required',
                      defaultMessage: '名称不能为空',
                    }),
                  },
                ],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'global.sceneType', defaultMessage: '场景类型' })}>
              {getFieldDecorator('sceneCategoryRemark', {
                initialValue: get(editData, 'sceneCategoryRemark', formatMessage({id: 'dashboard_000046', defaultMessage: '仪表盘'})),
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'global.sceneType.required',
                      defaultMessage: '场景类型不能为空',
                    }),
                  },
                ],
              })(<ComboList {...sceneCategoryProps} />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'dashboard_000048', defaultMessage: '序号'})}>
              {getFieldDecorator('rank', {
                initialValue: get(editData, 'rank', 0),
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'dashboard_000049', defaultMessage: '序号不能为空'}),
                  },
                ],
              })(<InputNumber precision={0} />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 4, offset: 5 }} className="btn-submit">
              <Button type="primary" loading={saving} onClick={this.handlerFormSubmit}>
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default SceneForm;
