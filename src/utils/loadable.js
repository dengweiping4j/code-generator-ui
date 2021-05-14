import React from 'react'
import Loadable from 'react-loadable'

const Loading = () => {
  return <div>loading...</div>
}

export default (Loader) => {
  const LoadableComponent = Loadable({
    loader: Loader,
    loading: Loading
  })

  return class LoadableHOC extends React.Component {
    render () {
      return <LoadableComponent></LoadableComponent>
    }
  }
}