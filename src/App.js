import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [pokemon, setPokemon] = useState({});
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('');
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);
    const [correctStreak, setCorrectStreak] = useState(0);

    useEffect(() => {
        fetchRandomPokemon();
    }, []);

    const fetchRandomPokemon = async () => {
        const randomId = Math.floor(Math.random() * 151) + 1;  // For first 151 pokemons
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        setPokemon({
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default
        });
        setGuessedCorrectly(false);
        setGuess('');
        setMessage('');
    }

    const handleGuess = () => {
        if (guess.toLowerCase() === pokemon.name.toLowerCase()) {
            setMessage(`Correct!`);
            setGuessedCorrectly(true);
            setCorrectStreak(prevStreak => prevStreak + 1);
        } else {
            setMessage('Wrong. Try again!');
            setCorrectStreak(0);
        }
    }
    
    const [overlayImage, setOverlayImage] = useState(null);

    useEffect(() => {
        if (pokemon.image) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 0) {
                        data[i] = 42;     // red value
                        data[i + 1] = 85; // green value
                        data[i + 2] = 177; // blue value
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                setOverlayImage(canvas.toDataURL());
            };
            img.src = pokemon.image;
        }
    }, [pokemon]);

    return (
        <div className="App">
            <h1>Who's that Pokemon?</h1>
            <div className="img-wrapper">
              <img 
                  src={guessedCorrectly ? pokemon.image : overlayImage} 
                  alt="Pokemon"
              />
            </div>
            <input 
                type="text" 
                placeholder="Enter Pokemon name" 
                value={guess} 
                onChange={(e) => setGuess(e.target.value)}
                className='input'
            />
            <button onClick={handleGuess}>Guess</button>
            <button onClick={fetchRandomPokemon}>Next</button>
            <p>Correct Streak: {correctStreak}</p>
            <p>{message}</p>
        </div>
    );
}

export default App;