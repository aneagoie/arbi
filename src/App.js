import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

const lowestPrice = (array) => {
  const price = array.map(item => item.last).sort();
  return price[0];
}

class App extends Component {
  constructor() {
    super()
      this.state = {
        data: null
      }
  }
  componentDidMount() {
    let exhangesArray = [];
    // fetch('https://min-api.cryptocompare.com/data/all/exchanges')
    fetch('https://api.cbix.ca/v1/index')
      .then(response => response.json())
      .then(exchanges => {
        const cleanData = exchanges.exchanges.map((exch, i) => {
          return {
            name: exch.name,
            currency: 'CAD',
            price: exch.last,
            volume: exch.volume_24hour,
            arb: lowestPrice(exchanges.exchanges)/exch.last
          }

        })
        this.setState({
          data: cleanData
        })
      })
  }
  render() {
    const columns = [{
      Header: 'Exchange Name',
      accessor: 'name' // String-based value accessors!
    }, {
      Header: 'Currency',
      accessor: 'currency',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'price',
      Header: 'Price',
      accessor: d => d.price // Custom value accessors!
    }, {
      id: 'arb',
      Header: '%arb',
      accessor: d => d.arb // Custom value accessors!
    }, {
      id: 'volume',
      Header: 'Volume 24h',
      accessor: d => d.volume // Custom value accessors!
    }]
    if (!this.state.data) {
      return <h1>waiting</h1>
    }
    return (
      <ReactTable
        data={this.state.data}
        columns={columns}
        defaultSorted={[
            {
              id: "price",
              desc: true
            }
          ]}
      />
    );
  }
}

export default App;
