import React, { PureComponent } from 'react';
import cls from 'classnames';
import { omit, get } from 'lodash';
import { Form, Input, Switch, InputNumber } from 'antd';
import { DropdownOption } from '@/components';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './EchartBarLine.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const formItemInlineLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class EchartBarLineForm extends PureComponent {
  constructor(props) {
    super(props);
    const { editData } = props;
    const renderConfig = editData ? JSON.parse(editData.renderConfig) : {};
    this.state = {
      timer: get(renderConfig, 'component.props.timer.interval', 0) > 0,
      showSummary: get(renderConfig, 'component.props.summary.show', false) || false,
    };
  }

  componentDidMount() {
    const { onFormRef } = this.props;
    if (onFormRef) {
      onFormRef(this);
    }
  }

  handlerFormSubmit = () => {
    const { timer, showSummary } = this.state;
    const { form, save, editData, widget, widgetGroup, color, personalUse } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        id: get(editData, 'id', null),
        name: formData.name,
        description: formData.description,
        personalUse,
        iconColor: color || '#333333',
        widgetGroupCode: widgetGroup.code,
        widgetGroupId: widgetGroup.id,
        widgetGroupName: widgetGroup.name,
        widgetTypeCode: widget.code,
        widgetTypeDescription: widget.description,
        widgetTypeIconType: widget.iconType,
        widgetTypeId: widget.id,
        widgetTypeName: widget.name,
      };
      const rest = omit(formData, ['id', 'name', 'description', 'iconColor']);
      const renderConfig = {
        component: {
          type: params.widgetTypeCode,
          icon: {
            type: params.widgetTypeIconType,
            color: params.iconColor,
          },
          name: params.widgetTypeName,
          description: params.widgetTypeDescription,
          props: {
            timer: {
              interval: timer ? rest.interval : 0,
            },
            summary: {
              show: showSummary,
              title: showSummary ? rest.summaryTitle : '',
              data: showSummary ? rest.summaryData : '',
            },
            title: params.name,
            store: {
              url: rest.storeUrl,
            },
            reader: {
              legendData: rest.legendData,
              seriesData: rest.seriesData,
              xAxisData: rest.xAxisData,
              yAxisData: rest.yAxisData,
            },
          },
        },
      };
      params.renderConfig = JSON.stringify(renderConfig);
      save(params);
    });
  };

  handlerTimerChange = checked => {
    this.setState({
      timer: checked,
    });
  };

  handlerSummaryChange = checked => {
    this.setState({
      showSummary: checked,
    });
  };

  handlerTimerIntervalChange = interval => {
    const { form } = this.props;
    form.setFieldsValue({
      interval,
    });
  };

  render() {
    const { timer, showSummary } = this.state;
    const { form, editData, widget } = this.props;
    const renderConfig = editData ? JSON.parse(editData.renderConfig) : {};
    const { getFieldDecorator } = form;
    const timerInterval = get(renderConfig, 'component.props.timer.interval', 0);
    return (
      <div className={cls(styles['form-box'])}>
        <Form {...formItemLayout} layout="vertical">
          <div className="title-group">{formatMessage({id: 'dashboard_000114', defaultMessage: '基本配置'})}</div>
          <FormItem hasFeedback label={formatMessage({id: 'dashboard_000103', defaultMessage: '组件类型'})}>
            {getFieldDecorator('widgetType', {
              initialValue: get(editData, 'widgetTypeName', widget.name || null),
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Input addonBefore={get(editData, 'widgetTypeCode', widget.code || null)} disabled />,
            )}
          </FormItem>
          <FormItem hasFeedback label={formatMessage({id: 'dashboard_000115', defaultMessage: '业务名称'})}>
            {getFieldDecorator('name', {
              initialValue: get(editData, 'name', null),
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'dashboard_000116', defaultMessage: '业务名称不能为空'}),
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'dashboard_000117', defaultMessage: '功能描述'})}>
            {getFieldDecorator('description', {
              initialValue: get(editData, 'description', null),
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'dashboard_000108', defaultMessage: '功能描述不能为空'}),
                },
              ],
            })(<TextArea style={{ resize: 'none' }} autoSize={false} rows={4} />)}
          </FormItem>
          <div className="title-group">{formatMessage({id: 'dashboard_000118', defaultMessage: '定时器'})}</div>
          <FormItem label={formatMessage({id: 'dashboard_000119', defaultMessage: '启用定时器'})} {...formItemInlineLayout} style={{ marginBottom: 0 }}>
            <Switch size="small" checked={timer} onChange={this.handlerTimerChange} />
          </FormItem>
          {timer ? (
            <FormItem
              layout="inline"
              className="timer-body"
              label={formatMessage({id: 'dashboard_000120', defaultMessage: '间隔时间(分钟)'})}
              {...formItemInlineLayout}
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator('interval', {
                initialValue: timerInterval,
              })(<InputNumber precision={0} />)}
              <DropdownOption interval={timerInterval} onChange={this.handlerTimerIntervalChange} />
            </FormItem>
          ) : null}
          <div className="title-group">{formatMessage({id: 'dashboard_000121', defaultMessage: '数据配置'})}</div>
          <FormItem label={formatMessage({id: 'dashboard_000122', defaultMessage: '数据接口'})} hasFeedback>
            {getFieldDecorator('storeUrl', {
              initialValue: get(renderConfig, 'component.props.store.url', null),
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'dashboard_000123', defaultMessage: '数据接口不能为空'}),
                },
              ],
            })(<Input />)}
            <p className="desc">{formatMessage({id: 'dashboard_000124', defaultMessage: '数据接口可以是相对路径也可以是以http(s)开头的绝对路径'})}</p>
          </FormItem>
          <FormItem label={formatMessage({id: 'dashboard_000149', defaultMessage: '图例'})} hasFeedback>
            {getFieldDecorator('legendData', {
              initialValue: get(renderConfig, 'component.props.reader.legendData', null),
              rules: [
                {
                  required: false,
                  message: formatMessage({id: 'dashboard_000150', defaultMessage: '图例不能为空'}),
                },
              ],
            })(<Input />)}
            <p className="desc">{formatMessage({id: 'dashboard_000151', defaultMessage: '图例数据节点'})}:{formatMessage({id: 'dashboard_000152', defaultMessage: '接口返回数据结构请参照官网Echart的legend配置'})}</p>
          </FormItem>
          <FormItem label={formatMessage({id: 'dashboard_000163', defaultMessage: 'X轴'})} hasFeedback>
            {getFieldDecorator('xAxisData', {
              initialValue: get(renderConfig, 'component.props.reader.xAxisData', null),
              rules: [
                {
                  required: false,
                  message: formatMessage({id: 'dashboard_000164', defaultMessage: 'X轴不能为空'}),
                },
              ],
            })(<Input />)}
            <p className="desc">
              {formatMessage({id: 'dashboard_000165', defaultMessage: 'X轴数据节点'})}:{formatMessage({id: 'dashboard_000166', defaultMessage: '轴线类型默认为'})}:{formatMessage({id: 'dashboard_000167', defaultMessage: 'category,接口返回数据结构请参照官网Echart的xAxis配置'})}
            </p>
          </FormItem>
          <FormItem label={formatMessage({id: 'dashboard_000168', defaultMessage: 'Y轴'})} hasFeedback>
            {getFieldDecorator('yAxisData', {
              initialValue: get(renderConfig, 'component.props.reader.yAxisData', null),
            })(<Input />)}
            <p className="desc">
              {formatMessage({id: 'dashboard_000169', defaultMessage: 'Y轴数据节点'})}:{formatMessage({id: 'dashboard_000166', defaultMessage: '轴线类型默认为'})}:{formatMessage({id: 'dashboard_000170', defaultMessage: 'value,接口返回数据结构请参照官网Echart的yAxis配置'})}
            </p>
          </FormItem>
          <FormItem label={formatMessage({id: 'dashboard_000153', defaultMessage: '系列'})} hasFeedback>
            {getFieldDecorator('seriesData', {
              initialValue: get(renderConfig, 'component.props.reader.seriesData', null),
              rules: [
                {
                  required: false,
                  message: formatMessage({id: 'dashboard_000154', defaultMessage: '系列不能为空'}),
                },
              ],
            })(<Input />)}
            <p className="desc">{formatMessage({id: 'dashboard_000155', defaultMessage: '系列数据节点'})}:{formatMessage({id: 'dashboard_000156', defaultMessage: '接口返回数据结构请参照官网Echart的series配置'})}</p>
          </FormItem>
          <div className="title-group">{formatMessage({id: 'dashboard_000128', defaultMessage: '其它'})}</div>
          <FormItem label={formatMessage({id: 'dashboard_000157', defaultMessage: '显示汇总'})} {...formItemInlineLayout} style={{ marginBottom: 0 }}>
            <Switch size="small" checked={showSummary} onChange={this.handlerSummaryChange} />
          </FormItem>
          {showSummary ? (
            <>
              <FormItem label={formatMessage({id: 'dashboard_000158', defaultMessage: '汇总标题'})} hasFeedback>
                {getFieldDecorator('summaryTitle', {
                  initialValue: get(renderConfig, 'component.props.summary.title', null),
                  rules: [
                    {
                      required: true,
                      message: formatMessage({id: 'dashboard_000159', defaultMessage: '汇总标题不能为空'}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({id: 'dashboard_000160', defaultMessage: '汇总数据'})} hasFeedback>
                {getFieldDecorator('summaryData', {
                  initialValue: get(renderConfig, 'component.props.summary.data', null),
                  rules: [
                    {
                      required: true,
                      message: formatMessage({id: 'dashboard_000161', defaultMessage: '汇总数据不能为空'}),
                    },
                  ],
                })(<Input />)}
                <p className="desc">{formatMessage({id: 'dashboard_000162', defaultMessage: '接口返回数据体的汇总数据节点属性名称'})}</p>
              </FormItem>
            </>
          ) : null}
        </Form>
      </div>
    );
  }
}

export default EchartBarLineForm;
