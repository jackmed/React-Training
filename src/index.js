import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Board extends React.Component {
  renderOneRowSquare(rowArr) {
    return <div className="board-row" key={rowArr[0]}>
      {rowArr.map((item, index) => {
        return <Square key={item} value={this.props.squares[item]} onClick={() => this.props.onClick(item)}/>
      })}
    </div>;
  }

  render() {
    const threeRowComponent = Array(3).fill(null);
    for(let i=0;i<3;i++) {
      let rowArr = Array(3);
      for(let j=0;j<3;j++) {
        rowArr[j] = j + 3 * i;
      }
      threeRowComponent[i] = this.renderOneRowSquare(rowArr);
    }

    return (
      <div>
        {threeRowComponent}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xAxis: null,
        yAxis: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      historyAscOrder: true,
      boldStep: null,
    }

    this.handleReverseHistory = this.handleReverseHistory.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const coordinates = this.getCoordinates(i);
    this.setState({
      history: history.concat([{
        squares: squares,
        xAxis: coordinates.xAxis,
        yAxis: coordinates.yAxis
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleReverseHistory() {
    this.setState({
      historyAscOrder: !this.state.historyAscOrder
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step %2 ) === 0,
      boldStep: step,
    })
  }
  getCoordinates(i) {
    return {
      xAxis: i %3,
      yAxis: parseInt(i/3)
    }
  }

  render() {
    const history = this.state.history;
    const boldStep = this.state.boldStep;
    const currentSquares = history[this.state.stepNumber];

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={currentSquares.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <Status currentSquares={currentSquares} stepNumber={this.state.stepNumber} xIsNext={this.state.xIsNext}/>
        <History history={history} boldStep={boldStep} historyAscOrder={this.state.historyAscOrder} jumpTo={this.jumpTo}/>
        <ReverseHistoryView onClick={this.handleReverseHistory}/>
      </div>
    );
  }
}

class ReverseHistoryView extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game-info">
        <input type="button"  value="反序历史记录" onClick={this.props.onClick}/>
      </div>
    );
  }
}

class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  getWinnerStatus() {
    const winner = calculateWinner(this.props.currentSquares.squares);
    let status;
    if (winner) {
      status = "winner: " + winner;
    } else {
      status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
    }
    return status;
  }

  render() {
    const status = this.getWinnerStatus();
    return (
      <div className="game-info">
        <div>{status}</div>
      </div>
    )
  }
}

class History extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let historyInfo;
    const history = this.props.history;
    if (this.props.historyAscOrder) {
      historyInfo = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button
              onClick={() => this.props.jumpTo(move)}
              className={this.props.boldStep===move ? "selectHistory" : null}
            >{desc}
            </button>
            <Coordinates move={move} step={step}/>
          </li>
        );
      })
    } else {
      const len = history.length;
      const tmp = history.slice(0,  history.length);
      historyInfo = tmp.reverse().map((step, move) => {
        const desc = step.xAxis!= null ?
          'Go to move #' + (len - move -1) :
          'Go to game start';
        return (
          <li key={(len - move -1)}>
            <button
              onClick={() => this.props.jumpTo((len - move -1))}
              className={this.props.boldStep===(len - move -1) ? "selectHistory" : null}
            >{desc}
            </button>
            <Coordinates move={(len - move -1)} step={step}/>
          </li>
        );
      })
    }
    return (
      <div className="game-info">
        <ol>{historyInfo}</ol>
      </div>
    );
  }
}

/**
 * 每步坐标组件
 * @return {null}
 */
function Coordinates(props) {
  if (props.step.xAxis != null) {
    return (
      <span>({props.step.xAxis}, {props.step.yAxis})</span>
    )
  }
  return null;
}

/**
 * 方格组件
 * @param props
 * @returns {*}
 * @constructor
 */
function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
