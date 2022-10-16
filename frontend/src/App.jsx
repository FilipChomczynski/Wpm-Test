import {useState, useEffect} from 'react';
import './App.css';
import {FetchWord} from "../wailsjs/go/main/App"

function App() {

    const [word, setWord] = useState([]);
    const [wordsCount, setWordCount] = useState(0);
    const [letter, setLetter] = useState(0)
    const [clicked, setClicked] = useState("");
    const [time, setTime] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [timeCounter, setTimeCounter] = useState();
    const [correctPr, setCorrectPr] = useState();

    let counter = null;
    let pouse = false
    useEffect(() => {
        window.addEventListener('keydown', e=>{
            // pouse = false
            console.log(pouse);
            if (counter == null) {
                console.log("towrze");
                counter = setInterval(() => {
                    if (!pouse) {
                        setTime(t => t + 1)
                        
                    }
                }, 1000);
            }
            // setTimeCounter(counter)

            setLetter(letter => letter + 1)
            setClicked(e.key)
        })


    }, []);

    useEffect(() => {
        if (wordsCount >=10) {
            setCorrectPr(Math.round(100 - mistakes/(correct + mistakes) * 100));
            pouse = true

            window.addEventListener('keydown', reset)
        }
    }, [wordsCount])

    useEffect(()=> {
        let w = document.querySelector(".word" + (letter - 1))
        if (clicked == word[letter - 1]) {
            setCorrect(c => c + 1)
            w.className = "succes"
        }
        else if (clicked != word[letter - 1] && letter != 0) {
            setMistakes(m => m + 1)
            w.className = "fail"
        }

        if (letter >= word.length) {
            setLetter(0)
            fetchWord()
            document.querySelectorAll("#fetched-text").forEach((e, i) => {
                e.className = "word" + i
            })


        }
    }, [letter, setLetter])

    function reset() {
        setWordCount(0);
        setCorrect(0);
        setMistakes(0);
        setTime(0);
        setCorrectPr(0);
        window.removeEventListener('keydown', reset)
    }

    function fetchWord() {
        FetchWord().then(res => setWord(res.slice(2, -2).split('')));
        setWordCount(count => count + 1)
    }

    function renderWord() {
        let letters = []
        for (let i = 0; i<word.length; i++) {
            letters.push(<h3 id='fetched-text' key={i.toString()} className={"word" + i}>{word[i]}</h3>)
        }
        return letters
    }

    return (
        <>  
            <div id='info'>
                <h1 id='header'>WPM test</h1>
                <p>Write 10 words as fast as you can to get your result.</p>
                <br />
                <h1>{correct}</h1>
                <h1>{mistakes}</h1>
                <h1>{time}</h1>
                <h1>{wordsCount}</h1>
                <h1>{correctPr}</h1>
                <div id='result'>
                    <h1>{wordsCount >= 10 ? 'WPM: ' + (((correct + mistakes)/5) / (time / 60)).toString().slice(0, 5): ''}</h1>
                    <h1>{wordsCount >= 10 ? 'AWPM: ' + ((((correct + mistakes)/5) / (time / 60)) / (correctPr * 0.01)).toString().slice(0, 4): ''}</h1>
                    <h1>{wordsCount >= 10 ? 'Correct: ' + correctPr + "%": ''}</h1>
                </div>

            </div>
            <div id='text' className="fetched-text">
                {renderWord()}
            </div>
        </>
    )
}

export default App
