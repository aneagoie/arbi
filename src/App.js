import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class App extends Component {
  constructor() {
    super()
      this.state = {
        data: null
      }
  }

  lowestPrice = (array) => {
    const price = array.map(item => item.last).sort();
    const exchange = array.filter(item => item.last === price[0]);
    return exchange[0]
  }

  componentDidMount() {
    fetch('https://api.cbix.ca/v1/index')
      .then(response => response.json())
      .then(resp => {
        const exchanges = resp.exchanges;
        const lowestPriceNumber = this.lowestPrice(exchanges).last;
        const lowestPriceExchange = this.lowestPrice(exchanges).name;
        const cleanData = exchanges.map(exch => {
          if (exch.last/lowestPriceNumber > 1.2) {
            console.log(`There is arbitrage possibility of ${(exch.last/lowestPriceNumber).toFixed(3)}% between ${exch.name} and ${lowestPriceExchange}.
                        If you put $10,000 you could make $${parseInt(10000*(exch.last/lowestPriceNumber - 1), 10)}. check out the details: https://aneagoie.github.io/arbi/`);
          }
          return {
            name: exch.name,
            currency: 'CAD',
            price: '$ ' + exch.last,
            ask: '$ ' + exch.ask,
            bid: '$ ' + exch.bid,
            volume: exch.volume_24hour + ' BTC',
            arb: exch.last/lowestPriceNumber
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
      Header: 'Last',
      accessor: d => d.price // Custom value accessors!
    }, {
      id: 'arb',
      Header: '%arb',
      accessor: d => d.arb // Custom value accessors!
    }, {
      id: 'bid',
      Header: 'Bid',
      accessor: d => d.bid // Custom value accessors!
    }, {
      id: 'ask',
      Header: 'Ask',
      accessor: d => d.ask // Custom value accessors!
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
