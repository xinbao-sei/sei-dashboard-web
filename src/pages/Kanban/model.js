import { omit } from 'lodash';
import { message } from "antd";
import { utils } from 'suid';
import { Widgets } from '../../components';
import { constants } from '../../utils';
import { getSceneByCode } from "./service";

const { pathMatchRegexp, dvaModel, storage } = utils;
const { modelExtend, model } = dvaModel;
const { ECHART } = constants;
const { EchartPie, EchartBarLine } = Widgets;
const { COMPONENT_TYPE } = constants;
const defaultSkin = storage.localStorage.get("primarySkin") || 'light';

const getWidget = (widget, layout, theme) => {
    const { echart } = theme;
    if (widget.renderConfig) {
        const renderConfig = JSON.parse(widget.renderConfig);
        const { component } = renderConfig;
        const defaultLayout = layout || {
            w: 4,
            h: 4,
            x: 0,
            y: 0,
            i: widget.id,
        };
        const closable = false;
        switch (component.type) {
            case COMPONENT_TYPE.ECHART_PIE:
                return {
                    id: widget.id,
                    widget: <EchartPie {...omit(component.props, ['title'])} skin={echart} />,
                    closable,
                    title: component.props.title,
                    layout: defaultLayout,
                };
            case COMPONENT_TYPE.ECHART_BAR_LINE:
                return {
                    id: widget.id,
                    widget: <EchartBarLine {...omit(component.props, ['title'])} skin={echart} />,
                    closable,
                    title: component.props.title,
                    layout: defaultLayout,
                };
            default:
                return null;
        }
    }
    return null;
};

export default modelExtend(model, {
    namespace: "kanban",

    state: {
        widgets: [],
        layouts: {},
        widgetRenderData: [],
        theme: {
            primarySkin: defaultSkin,
            echart: ECHART[defaultSkin],
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                const match = pathMatchRegexp('/scene/kanban/:code', location.pathname);
                if (match) {
                    dispatch({
                        type: "getSceneByCode",
                        payload: {
                            code: match[1],
                        }
                    });
                }
            });
        }
    },
    effects: {
        * getSceneByCode({ payload }, { call, put }) {
            const re = yield call(getSceneByCode, payload);
            if (re.success) {
                const { config, instanceDtos } = re.data;
                const { layouts, theme } = JSON.parse(config);
                const widgets = [];
                instanceDtos.forEach(w => {
                    const layoutKeys = Object.keys(layouts);
                    let layout = null;
                    if (layoutKeys.length > 0) {
                        const tmps = layouts[layoutKeys[0]].filter(l => l.i === w.id);
                        if (tmps.length > 0) {
                            layout = tmps[0];
                        }
                    }
                    const cmp = getWidget(w, layout, theme);
                    if (cmp) {
                        widgets.push(cmp);
                    }
                });
                yield put({
                    type: "updateState",
                    payload: {
                        widgets,
                        layouts,
                        theme,
                        widgetRenderData: instanceDtos,
                    }
                });
            } else {
                message.error(re.message);
            }
        },
    }
});