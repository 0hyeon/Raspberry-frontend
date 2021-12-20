import React from "react";
import { Carousel, WingBlank } from 'antd-mobile';
import {API_URL} from "../src/config/constants.js";
class SliderMobile extends React.Component {
  
  state = {
    data: ['1', '2', '3'],
    imgHeight: 176,
  }
  componentDidMount() {

    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['uploads/1.jpg','uploads/2.jpg','uploads/3.jpg','uploads/4.jpg','uploads/8.jpg',],
      });
    }, 100);
  }
  
  render() {
    return (
      <WingBlank>
        <Carousel
          autoplay={true}
          infinite
          dots={true}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(val => (
            <a
              key={val}
              href="/"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight}}
            >
              <img
                src={`${API_URL}/${val}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}

export default SliderMobile;
// ReactDOM.render(<App />);