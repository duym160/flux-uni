/**
 * uView 组件默认 Props 配置
 * 用于动态修改组件的主题色
 */
export default ({ primaryColor } = {}) => {
  const colorProps = {
    color: primaryColor,
  };
  const activeColorProps = {
    activeColor: primaryColor,
  };

  // 返回对象为 uni.$u.setConfig({props}) 的 props
  return {
    datetimePicker: {
      confirmColor: primaryColor,
    },
    calendar: colorProps,
    checkboxGroup: activeColorProps,
    radioGroup: activeColorProps,
    switch: activeColorProps,
    // 更多组件配置...
  };
};
