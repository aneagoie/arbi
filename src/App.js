import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

const interestedExhanges = [
  'Coinbase',
  'Bittrex',
  'QuadrigaCX'
]

class App extends Component {
  constructor() {
    super()
      this.state = {
        data: null
      }
  }
  componentDidMount() {
    let exhangesArray = [];
    fetch('https://min-api.cryptocompare.com/data/all/exchanges')
      .then(response => response.json())
      .then(exchanges => {
        console.log('exchanges', Object.keys(exchanges))
        const interested = Object.keys(exchanges)
          .filter(exhangesSym => {
            return (
              exhangesSym === 'Coinbase' ||
              exhangesSym === 'QuadrigaCX' ||
              exhangesSym === 'Kraken' ||
              exhangesSym === 'Poloniex' ||
              exhangesSym === 'Bitstamp' ||
              exhangesSym === 'Bitfinex' ||
              exhangesSym === 'BitTrex' ||
              exhangesSym === 'Gemini'
            )
          })
        exhangesArray = interested;
        const requests = interested.map(exhangesSym => {
          return `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&e=${exhangesSym}&extraParams=your_app_name`
        })
        Promise.all(requests.map(url => fetch(url)))
          .then(resp => Promise.all(resp.map(r => r.json()) ))
          .then(e => {
            console.log(exhangesArray[0], e);
            return e
          })
          .then((data) => {
            const cleanData = data.map((exch, i) => {
              return {
                name: exhangesArray[i],
                currency: Object.keys(exch),
                price: exch.USD
              }
            })
            this.setState({
              data: cleanData
            })
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
