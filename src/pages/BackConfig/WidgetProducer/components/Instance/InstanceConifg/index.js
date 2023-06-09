import React, { PureComponent, Suspense } from 'react';
import cls from 'classnames';
import { isEqual, get } from 'lodash';
import { connect } from 'dva';
import { Drawer, Button, Avatar, Switch } from 'antd';
import { ScrollBar, ExtIcon, ListLoader } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import { ColorSelect } from '../../../../../../components';
import WidgetSelect from '../../WidgetSelect';
import { constants } from '../../../../../../utils';
import styles from './index.less';

const EchartPie = React.lazy(() => import('./Forms/EchartPie'));
const EchartBarLine = React.lazy(() => import('./Forms/EchartBarLine'));
const StatisticGrid = React.lazy(() => import('./Forms/StatisticGrid'));
const MyWorkTodo = React.lazy(() => import('./Forms/MyWorkTodo'));
const MyWorkDone = React.lazy(() => import('./Forms/MyWorkDone'));
const MyOrderInProcess = React.lazy(() => import('./Forms/MyOrderInProcess'));
const MyFavoriteMenu = React.lazy(() => import('./Forms/MyFavoriteMenu'));
const EchartGauge = React.lazy(() => import('./Forms/Gauge'));

const { COMPONENT_TYPE } = constants;

@connect(({ widgetInstance, loading }) => ({ widgetInstance, loading }))
class InstanceConfig extends PureComponent {
  constructor(props) {
    super(props);
    const { widgetInstance } = props;
    const { currentWidgetInstance } = widgetInstance;
    const personalUse = get(currentWidgetInstance, 'personalUse', false) || false;
    this.state = {
      color: '',
      showShadow: false,
      currentWidget: null,
      personalUse,
    };
  }

  componentDidUpdate(prevProps) {
    const { widgetInstance } = this.props;
    const { showFormModal, currentWidgetInstance } = widgetInstance;
    if (!isEqual(prevProps.widgetInstance.showFormModal, showFormModal) && showFormModal === true) {
      this.getWidgetList();
      this.getCurrentWidgetInstance();
    }
    if (!isEqual(prevProps.widgetInstance.currentWidgetInstance, currentWidgetInstance)) {
      const personalUse = get(currentWidgetInstance, 'personalUse', false) || false;
      this.setState({ personalUse });
    }
  }

  getCurrentWidgetInstance = () => {
    const { widgetInstance, dispatch } = this.props;
    const { currentWidgetInstance } = widgetInstance;
    if (currentWidgetInstance) {
      dispatch({
        type: 'widgetInstance/getWidgetInstanceById',
        payload: {
          id: currentWidgetInstance.id,
        },
        callback: res => {
          if (res.success) {
            let currentWidget = null;
            let color = '';
            const { widgetTypeId, renderConfig } = res.data;
            const component = JSON.parse(renderConfig);
            currentWidget = {
              id: widgetTypeId,
              name: get(component, 'component.name', ''),
              code: get(component, 'component.type', ''),
              iconType: get(component, 'component.icon.type', ''),
              description: get(component, 'component.description', ''),
            };
            color = get(component, 'component.icon.color', '');
            this.setState({ currentWidget, color });
          }
        },
      });
    } else {
      this.setState({
        color: '',
        showShadow: false,
        currentWidget: null,
      });
    }
  };

  getWidgetList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'widgetInstance/getWidgetList',
    });
  };

  handlerFormRef = ref => {
    this.formRef = ref;
  };

  handlerClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'widgetInstance/updateState',
      payload: {
        showFormModal: false,
        currentWidgetInstance: null,
      },
    });
  };

  handlerWidgetChnage = currentWidget => {
    this.setState({ currentWidget });
  };

  handlerColorChange = color => {
    this.setState({ color });
  };

  handerScrollDown = () => {
    this.setState({ showShadow: true });
  };

  handerYReachStart = () => {
    this.setState({ showShadow: false });
  };

  handlerPersonalUseChange = checked => {
    this.setState({
      personalUse: checked,
    });
  };

  renderTitle = () => {
    const { widgetInstance } = this.props;
    const { currentWidgetInstance } = widgetInstance;
    if (currentWidgetInstance) {
      return formatMessage({ id: 'dashboard_000110', defaultMessage: '编辑看板组件实例' });
    }
    return formatMessage({ id: 'dashboard_000111', defaultMessage: '新建看板组件实例' });
  };

  renderForm = () => {
    const { currentWidget, color, personalUse } = this.state;
    const { widgetInstance, currentWidgetGroup, save } = this.props;
    const { currentWidgetInstance } = widgetInstance;
    const formProps = {
      widgetGroup: currentWidgetGroup,
      widget: currentWidget,
      editData: currentWidgetInstance,
      color,
      save,
      personalUse,
      onFormRef: this.handlerFormRef,
    };
    if (currentWidget) {
      switch (currentWidget.code) {
        case COMPONENT_TYPE.ECHART_PIE:
          return (
            <Suspense fallback={<ListLoader />}>
              <EchartPie {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.ECHART_BAR_LINE:
          return (
            <Suspense fallback={<ListLoader />}>
              <EchartBarLine {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.ECHART_GAUGE:
          return (
            <Suspense fallback={<ListLoader />}>
              <EchartGauge {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.STATISTIC_GRID:
          return (
            <Suspense fallback={<ListLoader />}>
              <StatisticGrid {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.MY_WORK_TODO:
          return (
            <Suspense fallback={<ListLoader />}>
              <MyWorkTodo {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.MY_WORK_DONE:
          return (
            <Suspense fallback={<ListLoader />}>
              <MyWorkDone {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.MY_ORDER_IN_PROCESS:
          return (
            <Suspense fallback={<ListLoader />}>
              <MyOrderInProcess {...formProps} />
            </Suspense>
          );
        case COMPONENT_TYPE.MY_FAVORITE_MENU:
          return (
            <Suspense fallback={<ListLoader />}>
              <MyFavoriteMenu {...formProps} />
            </Suspense>
          );
        default:
      }
    }
  };

  render() {
    const { widgetInstance, loading } = this.props;
    const { showFormModal, widgetData } = widgetInstance;
    const { color, currentWidget, showShadow, personalUse } = this.state;
    const widgetDataLoading = loading.effects['widgetInstance/getWidgetList'];
    const widgetInstanceLoading = loading.effects['widgetInstance/getWidgetInstanceById'];
    const saving = loading.effects['widgetInstance/saveWidgetInstance'];
    const headerStyle = {
      boxShadow: showShadow ? ' 0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
    };
    const personalUseProps = {
      checked: personalUse,
      onChange: this.handlerPersonalUseChange,
    };
    return (
      <Drawer
        width={480}
        getContainer={false}
        placement="right"
        visible={showFormModal}
        destroyOnClose
        title={this.renderTitle()}
        headerStyle={headerStyle}
        className={cls(styles['widget-instance-config-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        {widgetInstanceLoading ? (
          <ListLoader />
        ) : (
          <>
            <div className="form-body">
              <ScrollBar
                onYReachStart={this.handerYReachStart}
                onScrollDown={this.handerScrollDown}
              >
                <div className="box-item">
                  <div className="title">
                    {formatMessage({ id: 'dashboard_000112', defaultMessage: '组件信息' })}
                  </div>
                  <div className="widget-box horizontal">
                    <div className="row-start widget-icon">
                      <ColorSelect
                        onChange={this.handlerColorChange}
                        color={color}
                        triggerStyle={{ fontSize: '2.4rem' }}
                      >
                        {currentWidget ? (
                          <ExtIcon type={currentWidget.iconType} style={{ color, fontSize: 64 }} />
                        ) : (
                          <Avatar shape="square" size={64} icon="question" style={{ color }} />
                        )}
                      </ColorSelect>
                    </div>
                    <div className="tool-box">
                      <WidgetSelect
                        dataSource={widgetData}
                        widget={currentWidget}
                        onChange={this.handlerWidgetChnage}
                        loading={widgetDataLoading}
                      />
                      <div className="desc">
                        {currentWidget ? currentWidget.description : '请选择组件类型!'}
                      </div>
                    </div>
                  </div>
                </div>
                {currentWidget ? (
                  <div className="box-item">
                    <div className="title">
                      {formatMessage({ id: 'dashboard_000113', defaultMessage: '用于个人' })}
                    </div>
                    <div style={{ padding: '0 24px' }}>
                      <Switch size="small" {...personalUseProps} />
                    </div>
                  </div>
                ) : null}
                <div className="box-item">{this.renderForm()}</div>
              </ScrollBar>
            </div>
            <div className="footer-tool-box">
              <Button
                disabled={!currentWidget}
                type="primary"
                loading={saving}
                onClick={() => this.formRef.handlerFormSubmit()}
              >
                {formatMessage({ id: 'dashboard_000030', defaultMessage: '保存' })}
              </Button>
            </div>
          </>
        )}
      </Drawer>
    );
  }
}

export default InstanceConfig;
