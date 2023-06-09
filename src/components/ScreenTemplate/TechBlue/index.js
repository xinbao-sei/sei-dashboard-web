import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get, omit, startCase } from 'lodash';
import { Col, Layout, Row } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import TimeClock from '../../TimeClock';
import Widgets from '../../Widgets';
import { constants } from '../../../utils';
import styles from './index.less';

const { Header, Content } = Layout;
const { COMPONENT_TYPE } = constants;
const { EchartPie, EchartBarLine, StatisticGrid } = Widgets;

class TechBlue extends Component {
  static propTypes = {
    editor: PropTypes.bool,
    templateConfig: PropTypes.object,
    instanceDtos: PropTypes.array,
  };

  getFormConifgValue = (field, defaultValue) => {
    const { templateConfig } = this.props;
    const regionRoot = field.split('-')[0];
    let value = defaultValue;
    const formConifg = get(templateConfig, [regionRoot, 'formConifg'], []) || [];
    for (let i = 0; i < formConifg.length; i += 1) {
      if (formConifg[i].field === field) {
        value =
          get(templateConfig, [regionRoot, 'formConifg', i.toString(), 'value'], defaultValue) ||
          defaultValue;
        break;
      }
    }
    return value;
  };

  setEchartPieOption = data => {
    const { seriesData } = data;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      grid: {
        containLabel: true,
      },
      series: [
        {
          name: '',
          type: 'pie',
          color: ['#078EFF', '#63E8F2', '#FECE3C', '#F7717D', '#BC93EF'],
          center: ['50%', '50%'],
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          selectedMode: 'single',
          labelLine: {
            normal: {
              show: true,
              lineStyle: {
                color: '#6CBCF3',
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}\n{c}({d}%)',
          },
          data: seriesData,
        },
      ],
    };
    return option;
  };

  setEchartBarLineOption = (data, title, region) => {
    const { seriesData, xAxisData } = data;
    let option;
    if (region === 'center') {
      option = {
        title: {
          text: title,
          textStyle: {
            color: '#6CBCF3',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top: '18%',
          left: '6%',
          right: '6%',
          bottom: '8%',
          containLabel: false,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#233e64',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#6a9cd5',
              },
            },
            data: xAxisData.length > 0 ? xAxisData[0].data : [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#233e64',
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#6a9cd5',
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: {
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'RGBA(25, 179, 211, 0.8)',
                },
                {
                  offset: 0.8,
                  color: 'RGBA(25, 179, 211, 0.1)',
                },
              ],
            },
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 20,
            opacity: 0.6,
          },
          itemStyle: {
            color: 'RGBA(31, 217, 242, 0.4)',
            borderColor: '#1DCFEA',
            label: {
              show: false,
            },
          },
          lineStyle: {
            width: 1,
            type: 'solid',
          },
          data: seriesData.length > 0 ? seriesData[0].data : [],
        },
      };
    } else {
      option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: 10,
          top: 10,
          height: '100%',
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#6CBCF3',
            interval: 0,
          },
          data: xAxisData.length > 0 ? xAxisData[0].data : [],
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'rgba(31, 223, 255, 0.85)',
              },
            },
            barWidth: '30%',
            data: seriesData.length > 0 ? seriesData[0].data : [],
          },
        ],
      };
    }
    return option;
  };

  getWidget = (key, component, region) => {
    const { type, props } = component;
    const style = { backgroundColor: 'rgba(255,255,255,0.02)' };
    switch (type) {
      case COMPONENT_TYPE.ECHART_PIE:
        return (
          <EchartPie
            key={key}
            {...omit(props, ['title'])}
            style={style}
            theme={null}
            overwriteOption={this.setEchartPieOption}
          />
        );
      case COMPONENT_TYPE.ECHART_BAR_LINE:
        return (
          <EchartBarLine
            key={key}
            {...omit(props, ['title'])}
            theme={null}
            style={style}
            overwriteOption={data => this.setEchartBarLineOption(data, props.title, region)}
          />
        );
      case COMPONENT_TYPE.STATISTIC_GRID:
        return (
          <StatisticGrid
            key={key}
            {...omit(props, ['title'])}
            skin={null}
            className="statistic-grid-box"
          />
        );
      default:
        return null;
    }
  };

  getRenderConfigByDto = id => {
    const { instanceDtos } = this.props;
    const widgets = instanceDtos.filter(dto => dto.id === id);
    if (widgets.length === 1 && widgets[0].renderConfig) {
      const renderConfig = JSON.parse(widgets[0].renderConfig);
      const { component } = renderConfig;
      return component;
    }
    return null;
  };

  renderRegionWidget = region => {
    const { templateConfig } = this.props;
    const widgets = get(templateConfig, [region, 'widgets'], {}) || {};
    return (
      <>
        {Object.keys(widgets).map((key, index) => {
          const widget = widgets[key];
          if (widget && widget.renderConfig) {
            const renderConfig = JSON.parse(widget.renderConfig);
            const { component } = renderConfig;
            return this.getWidget(
              widget.id,
              this.getRenderConfigByDto(widget.id) || component,
              region,
            );
          }
          const regionIndex = startCase(`${region}${index + 1}`);
          return (
            <div className="chart" key={regionIndex}>
              {regionIndex}
            </div>
          );
        })}
      </>
    );
  };

  render() {
    return (
      <div className={cls(styles['screen-box'])}>
        <Layout className={cls('bg')}>
          <Header className="bg-head">
            <div className="time-wrap">
              <TimeClock color="#6cbcf3" />
            </div>
            <div className="screen-title">{this.getFormConifgValue('north-title', formatMessage({id: 'dashboard_000223', defaultMessage: '大屏标题'}))}</div>
          </Header>
          <Content className="view-box">
            <Row className="auto-height">
              <Col span={7} className="box">
                <div className="angle-top" />
                <div className="angle-bottom" />
                <div className="box-title">
                  {this.getFormConifgValue('west-title', '左侧区域标题')}
                </div>
                <div className="box-content">{this.renderRegionWidget('west')}</div>
              </Col>
              <Col span={10} className="center-content">
                {this.renderRegionWidget('center')}
              </Col>
              <Col span={7} className="box">
                <div className="angle-top" />
                <div className="angle-bottom" />
                <div className="box-title">
                  {this.getFormConifgValue('east-title', '右侧区域标题')}
                </div>
                <div className="box-content">{this.renderRegionWidget('east')}</div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default TechBlue;
