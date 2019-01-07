import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import hoinstNonReactStatics from 'hoist-non-react-statics';
function getDisplayName(WrappedComponent){
  return WrappedComponent.displayName || WrappedComponent.name || 'Loading';
}
export const withLoading=(WrappedComponent)=>{
  class Loading extends React.PureComponent{
    render(){
      const {loading}=this.props;
      if (loading)return <ActivityIndicator size='small' color="white" />;
      return <WrappedComponent{...this.props}/>;
    }
  }
  Loading.propTypes={
    loading: PropTypes.bool,
  };

  hoinstNonReactStatics(Loading, WrappedComponent);
  Loading.displayName=`WithLoading(${getDisplayName(WrappedComponent)})`;
  return Loading;
};

export default withLoading;
