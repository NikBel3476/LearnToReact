import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walkie',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

/*function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}*/

class App extends Component {
  constructor(props) {
    super(props);

    /*this.state = {
      list,
      searchTerm: '',
    };*/

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    const oldHits = page !== 0
      ? this.state.result.hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: { hits: updatedHits, page }
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: {...this.state.result,  hits: updatedHits }
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            Больше историй
          </Button>
        </div>
        {/*<form>
          <input 
            type="text"
            value={searchTerm}
            onChange={this.onSearchChange}
          />
        </form>
        {list.filter(isSearched(this.state.searchTerm)).map(item => {
          const onHandleDismiss = () => 
            this.onDismiss(item.objectID);

          return (
           <div key={item.objectID}>
             <span>
               <a href={item.url}>{item.title}</a>
             </span>
             <span>{item.author}</span>
             <span>{item.num_comments}</span>
             <span>{item.points}</span>
             <span>
                <button 
                  onClick={() => console.log(item.objectID)}
                  type="button"
                >
                  Отбросить
                </button>
             </span>
           </div>
          ) 
        }
      )}*/}
      </div>
    );
  }
}

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '10% '}}>
          {item.author}
        </span>
        <span style={{ width: '10% '}}>
          {item.num_comments}
        </span>
        <span style={{ width: '10% '}}>
          {item.points}
        </span>
        <span style={{ width: '10% '}}>
          <Button 
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Отбросить
          </Button>
        </span>
      </div>  
    )}
  </div>

const Button = ({ onClick, className = '', children}) =>
  <button
    onClick={onClick}
    className={className}
    type='button'
  >
    {children}
  </button>

const Search = ({ 
  value, 
  onChange, 
  onSubmit,
  children 
}) =>
    <form onSubmit={onSubmit}>
      <input
        typr="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>


export default App;

/*class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
    return (
      <form>
        {children} <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
    );
  }
}*/

/*class Table extends Component {
  render () {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div>
        {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <Button onClick={() => onDismiss(item.objectID)}>
                Отбросить
              </Button>
            </span>
          </div>  
        )}
      </div>
    )
  }
}*/

/*class Button extends Component {
  render () {
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}*/

/*class ExplainBindingsComponent extends Component {
  constructor() {
    super();

    this.onClickMe = this.onClickMe.bind(this);
  }

  onClickMe() {
    console.log(this);
  }

  render() {
    return (
      <button
        onClick={this.onClickMe}
        type="button"
      >
        Нажми на меня
      </button>
    );
  }
}*/

//export default ExplainBindingsComponent;


/*import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

/*class App extends Component {
  render() {
    return (
      <div className="App">
        {list.map(item => 
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </div>
        )}
      </div>
    );
  }
}*/
