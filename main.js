import { state, initGame, processInput, setupNextQuestion, resetGameState, updateHighScore } from './gameEngine.js';

const display = document.getElementById('wordDisplay');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const comboDisplay = document.getElementById('combo');
const startScreen = document.getElementById('start-screen');
const scoreContainer = document.getElementById('score-container');

function updateDisplay() {
    // タイトル画面の表示更新
    if (!isPlaying && !isResultScreen) {
        const selectedDiff = document.querySelector('input[name="difficulty"]:checked').value;
        const currentHighScore = state.highScores[selectedDiff] || 0;
        startScreen.querySelector('p').innerHTML = 
            `High Score (${selectedDiff}): ${currentHighScore}<br>Press [Space] to Start`;
        return;
    }

    // リザルト画面中は描画更新をロック
    if (isResultScreen) return;

    // プレイ中のワード表示
    let html = "";
    html += `<span style="color: red;">${state.completedInput}</span>`;
    const currentBlock = state.currentProblem.blocks[state.currentIndex];
    const model = currentBlock.model;
    const typed = state.currentBlockInput;

    if (model.startsWith(typed)) {
        html += `<span style="color: red;">${typed}</span>`;
        for (let i = typed.length; i < model.length; i++) {
            if (currentBlock.mask[i]) {
                html += `<span style="color: black;">${model[i]}</span>`;
            } else {
                html += "_";
            }
        }
    } else {
        html += `<span style="color: red;">${typed}</span>`;
        const remainingLength = state.validPaths[0].length - typed.length;
        html += "_".repeat(remainingLength);
    }

    for (let i = state.currentIndex + 1; i < state.currentProblem.blocks.length; i++) {
        const futureBlock = state.currentProblem.blocks[i];
        for (let j = 0; j < futureBlock.model.length; j++) {
            if (futureBlock.mask[j]) {
                html += `<span style="color: black;">${futureBlock.model[j]}</span>`;
            } else {
                html += "_";
            }
        }
    }
    display.innerHTML = html;

    scoreDisplay.textContent = state.score;
    comboDisplay.textContent = state.comboCount > 0 ? `${state.comboCount} Combo!` : "";
    const seconds = Math.max(0, state.timeLeft / 1000).toFixed(1);
    timerDisplay.textContent = `Time: ${seconds}s`;
}

let isPlaying = false; 
let isResultScreen = false;
let timerId = null;

initGame().then(() => {
    console.log("Ready.");
    updateDisplay();
});

// 難易度変更時にタイトル表示を更新
document.querySelectorAll('input[name="difficulty"]').forEach(input => {
    input.addEventListener('change', () => {
        if (!isPlaying && !isResultScreen) updateDisplay();
    });
});

// ゲーム開始処理の共通化（C++におけるStartGameメソッド相当）
function startGame() {
    isPlaying = true;
    isResultScreen = false;
    resetGameState(); // 内部変数のリセット

    // 現在の難易度を取得
    const selectedDiff = document.querySelector('input[name="difficulty"]:checked').value;
    state.difficulty = selectedDiff;

    // UIをプレイモードへ切り替え
    startScreen.style.display = 'none';
    display.style.display = 'block';
    scoreContainer.style.visibility = 'visible';
    timerDisplay.style.visibility = 'visible';
    comboDisplay.style.visibility = 'visible';

    setupNextQuestion();

    timerId = setInterval(() => {
        state.timeLeft -= 100;
        updateDisplay();
        
        if (state.timeLeft <= 0) {
            clearInterval(timerId);
            isPlaying = false;
            isResultScreen = true;
            
            const isNewRecord = updateHighScore();
            
            // UIの整理：プレイ用表示を隠す
            scoreContainer.style.visibility = 'hidden';
            timerDisplay.style.visibility = 'hidden';
            comboDisplay.style.visibility = 'hidden';
            
            // リザルト画面の描画
            display.innerHTML = `
                <span style="color: red; font-size: 1.6em;">TIME UP!</span><br>
                <span style="font-size: 0.8em; color: black;">Final Score: ${state.score}</span><br>
                ${isNewRecord ? '<span style="color: #f0ad4e; font-size: 0.8em;">NEW RECORD!</span><br>' : '<br>'}
                <div style="margin-top: 16px;">
                    <span style="font-size: 0.4em; color: #555;">Press [Space] to Restart</span><br>
                    <span style="font-size: 0.4em; color: #888;">Press [Q] for Title</span>
                </div>
            `;
        }
    }, 100);

    updateDisplay();
}

// キーボード入力を監視（ステートマシン的な管理）
document.addEventListener('keydown', (e) => {
    // 1. リザルト画面での分岐
    if (isResultScreen) {
        if (e.code === 'KeyQ' || e.key.toLowerCase() === 'q') {
            isResultScreen = false;
            display.style.display = 'none';
            startScreen.style.display = 'block';
            updateDisplay();
            return;
        }
        if (e.code === 'Space') {
            startGame();
            return;
        }
    }

    // 2. タイトル画面での開始処理
    if (!isPlaying && !isResultScreen && e.code === 'Space') {
        startGame();
        return;
    }

    // 3. プレイ中の入力処理
    if (isPlaying) {
        processInput(e.key.toLowerCase());
        updateDisplay();
    }
});