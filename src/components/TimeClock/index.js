import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const getTime = () => {
  return moment().format(
    `${formatMessage({ id: 'dashboard_000222', defaultMessage: 'YYYY年MM月DD日' })} dddd  HH:mm:ss`,
  );
};

class TimeClock extends PureComponent {
  static timer;

  static propTypes = {
    color: PropTypes.string,
  };

  static defaultProps = {
    color: '#ffffff',
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTime: getTime(),
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        currentTime: getTime(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  render() {
    const { color } = this.props;
    const { currentTime } = this.state;
    return (
      <span className={cls(styles['time-clock'])} style={{ color }}>
        {currentTime}
      </span>
    );
  }
}

export default TimeClock;
