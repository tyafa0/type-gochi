import { romajiDict } from './dict.js';
import { shuffle } from './utils.js';

export const state = {
    characters: [],
    deck: [],
    currentProblem: null,
    currentIndex: 0,
    currentBlockInput: "",
    completedInput: "",
    validPaths: [],
    comboCount: 0,
    difficulty: "Normal",
    score: 0,
    highScores: { Easy: 0, Normal: 0, Hard: 0 },
    timeLeft: 45000
};

// 難易度ごとの空欄率
const DIFFICULTY_RATES = {
    "Easy": 0.2,   
    "Normal": 0.5, 
    "Hard": 0.8    
};

export async function initGame() {
    try {
        // JSONファイルを読み込む
        const response = await fetch('./characters.json');
        const data = await response.json();
        state.characters = data.characters;

        // 山札を作成
        state.deck = shuffle([...state.characters]);

        // ハイスコアをローカルストレージから読み込む
        const savedScores = localStorage.getItem('typing_high_scores_map');
        if (savedScores) {
            state.highScores = JSON.parse(savedScores);
        }
    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
    }
}

export function resetGameState() {
    state.score = 0;
    state.timeLeft = 45000;
    state.comboCount = 0;
    state.currentIndex = 0;
    state.currentBlockInput = "";
    state.completedInput = "";
    state.deck = shuffle([...state.characters]);
}

export function updateHighScore() {
    const currentDiff = state.difficulty;
    if (state.score > state.highScores[currentDiff]) {
        state.highScores[currentDiff] = state.score;
        // オブジェクトを文字列化して保存
        localStorage.setItem('typing_high_scores_map', JSON.stringify(state.highScores));
        return true;
    }
    return false;
}

// 山札から次の問題を1つ取り出す関数
function getNextWord() {
    if (state.deck.length === 0) {
        state.deck = shuffle([...state.characters]); // 山札が空ならリセット
    }
    return state.deck.pop(); // 配列の末尾から1つ取り出して返す
}

// 次の問題をセットアップし、画面を初期化する関数
export function setupNextQuestion() {
    state.currentProblem = getNextWord();

    const holeRate = DIFFICULTY_RATES[state.difficulty];
    
    // 1. 全文字のインデックス（住所）リストを作成し、最初はすべて「表示(true)」にする
    const allChars = [];
    state.currentProblem.blocks.forEach((block, bIdx) => {
        block.mask = new Array(block.model.length).fill(true); 
        for (let i = 0; i < block.model.length; i++) {
            allChars.push({ bIdx: bIdx, i: i });
        }
    });

    // 2. 穴を開ける数を厳密に計算（総文字数 × 割合 を四捨五入）
    const numHoles = Math.round(allChars.length * holeRate);

    // 3. インデックスリストをシャッフルし、必要な数だけ「穴(false)」に変える
    const shuffledChars = shuffle([...allChars]);
    for (let j = 0; j < numHoles; j++) {
        const target = shuffledChars[j];
        state.currentProblem.blocks[target.bIdx].mask[target.i] = false;
    }

    state.currentIndex = 0;
    state.currentBlockInput = "";
    state.completedInput = "";

    console.log("現在のキャラクター:", state.currentProblem.display_name);

    const firstKana = state.currentProblem.blocks[0].kana;
    state.validPaths = [...romajiDict[firstKana]]; 
}

export function processInput(typedChar) {
    const tempInput = state.currentBlockInput + typedChar;
    const nextPaths = state.validPaths.filter(p => p.startsWith(tempInput));

    if (nextPaths.length === 0) {
        // ミスの処理
        console.log("MISS!");
        state.comboCount = 0;
    } else {
        // 成功の処理 
        console.log("HIT!");
        
        // 1. 状態を更新
        state.currentBlockInput = tempInput;
        state.validPaths = nextPaths; 

        let isBlockComplete = nextPaths.includes(state.currentBlockInput);

        if (isBlockComplete && state.currentBlockInput === "n" && state.currentProblem.blocks[state.currentIndex].kana === "ん") {
            
            // クリアを保留（nnを要求する状態にする）
            isBlockComplete = false; 

            // 次ブロックの存在チェック
            if (state.currentIndex + 1 < state.currentProblem.blocks.length) {
                // 次ブロックのmodelの先頭1文字を取得
                const nextBlockModel = state.currentProblem.blocks[state.currentIndex + 1].model;
                const nextFirstChar = nextBlockModel.charAt(0);
                
                // 次の文字が以下のリストに含まれなければ単押し(n)を許可
                const requireNN = ['a', 'i', 'u', 'e', 'o', 'n', 'y'].includes(nextFirstChar);
                if (!requireNN) {
                    isBlockComplete = true;
                }
            } else {
                // 最後のブロックだった場合、単押し(n)を許可
                isBlockComplete = true;
            }
        }

        // 3. 判定結果に基づく進行処理
        if (isBlockComplete) {
            // 次のブロックへ進む処理
            state.completedInput += state.currentBlockInput;
            state.currentIndex++;
            state.currentBlockInput = "";

            // クリア判定
            if (state.currentIndex === state.currentProblem.blocks.length) {
                console.log("Clear");
                
                // コンボを1増やす
                state.comboCount++;

                //　スコアの加算
                state.score += 1 * state.comboCount;

                // コンボ数に応じたタイム加算ロジック
                let addTime = 0;
                if (state.comboCount % 10 === 0) {
                    addTime = 15000; // 10n連: +15秒
                } else if (state.comboCount === 5) {
                    addTime = 10000; // 5連: +10秒
                } else if (state.comboCount === 3) {
                    addTime = 5000;  // 3連: +5秒
                }

                state.timeLeft += addTime; // 残り時間に加算
                console.log(`Combo: ${state.comboCount}, AddTime: ${addTime / 1000}秒`);

                setupNextQuestion();
            } else {
                // 問題がまだ続く場合、次のブロックの辞書データをロードする
                const nextKana = state.currentProblem.blocks[state.currentIndex].kana;
                state.validPaths = [...romajiDict[nextKana]];
            }
        }
    }
}