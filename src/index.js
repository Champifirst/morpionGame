import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Modal from './modal.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) { super(props);
        this.state = {     
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isModalOpen: true, // Add a state variable for modal visibility
            player1Name: '',
            player2Name: '',      
        };  
    }

    handleModalClose = () => {
        // Validate player names before closing
        if (!this.state.player1Name || !this.state.player2Name) {
            alert('Veillez renseigner vos noms!');
            return;
        }

        this.setState({ isModalOpen: false });
    };

    handlePlayerNameChange = (player, name) => {
        this.setState({ [player]: name });
    };

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        //s'il ya déjà un gagnant dans la partie du jeu
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        let player1, player2;
        
        if(this.state.player1Name !='' && this.state.player1Name !=''){
            for(let i = 0; i<this.state.player1Name.length; i++){
                if(this.state.player1Name[i]!= this.state.player2Name[i]){
                    player1 = this.state.player1Name[i];
                    player2 = this.state.player2Name[i];
                    break;
                } else{
                    player1 = '1';
                    player2 = '2';
                }
            }
        }

        squares[i] = this.state.xIsNext? player1 : player2;
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) =>{
            const desc = move?
                'Joueur '+ (move % 2? this.state.player1Name : this.state.player2Name) +' à la manche '+ move :
                'Début de la partie entre ' + this.state.player1Name +' et ' + this.state.player2Name;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = winner +' a gagné';
        } else {
            status = 'Prochain joueur :'+ (this.state.xIsNext ? this.state.player1Name : this.state.player2Name);
        }

        return (
            <div className="game">

                {this.state.isModalOpen == false && (
                    <div className="game">
                        <div className="game-board">
                            <Board 
                                squares = {current.squares}
                                onClick={(i) => this.handleClick(i)}
                            />
                        </div>
                        <div className="game-info">
                            <div>{status}</div>
                            <ol>{moves}</ol>
                        </div>
                    </div>
                )}

                {this.state.isModalOpen && (
                    <Modal onClose={this.handleModalClose}>
                        <h2>Entrez les noms des joueurs!</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="player1">Joueur 1:</label>
                            <input
                                type="text"
                                class="form-control"
                                id="player1"
                                placeholder='Nom du premier joueur'
                                value={this.state.player1Name}
                                onChange={(e) => this.handlePlayerNameChange('player1Name', e.target.value)}
                                required
                            /> <br/>
                            <label htmlFor="player2">Joueur 2:</label>
                            <input
                                type="text"
                                id="player2"
                                class="form-control"
                                placeholder='Nom du second joueur'
                                value={this.state.player2Name}
                                onChange={(e) => this.handlePlayerNameChange('player2Name', e.target.value)}
                                required
                            />
                            <button class="form-control mt-4 bg-success" type="submit" onClick={this.handleModalClose}>
                                Démarrer le jeu
                            </button>
                        </form>
                    </Modal>
                )}

               
                
            </div>
        );
    }
}


function calculateWinner(squares){
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
    
    for (let i=0; i<lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
  