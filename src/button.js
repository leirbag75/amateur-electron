import React from 'react';

export default class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animation: null
    };
  }

  updateAnimation() {
    this.setState({animation: !this.state.animation});
  }

  animationClass() {
    if(this.state.animation === null)
      return '';
    return this.state.animation? 'animation1': 'animation2';
  }

  onClick = () => {
    this.updateAnimation();
    this.props.onClick();
  }

  render() {
    return <div
             className={`${this.props.className} material-icons ${this.animationClass()}`}
             onClick={this.onClick}
           >
             {this.props.children}
           </div>
  }

}
