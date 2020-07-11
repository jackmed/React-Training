import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

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
        boldStep: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
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

    const winner = calculateWinner(currentSquares.squares);
    let status;
    if (winner) {
      status = "winner: " + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const historyInfo = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={boldStep===move ? "selectHistory" : null}
          >{desc}
          </button>
          <Coordinates move={move} step={step}/>
        </li>
      );
    })
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={currentSquares.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{historyInfo}</ol>
        </div>
      </div>
    );
  }
}

/**
 * 每步坐标组件
 * @return {null}
 */
function Coordinates(props) {
  if (props.move >0) {
    return (
      <span>({props.step.xAxis}, {props.step.yAxis})</span>
    )
  }
  return null;
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
