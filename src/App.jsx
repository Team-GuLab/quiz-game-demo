import { useState, useEffect } from 'react'
import './App.css'
import GameBoard2D from './components/GameBoard2D'
import GameScene3D from './components/GameScene3D'

const QUESTIONS = [
  {
    id: 1,
    question: "React의 핵심 개념이 아닌 것은?",
    options: ["Component", "Virtual DOM", "JSX", "SQL Query"],
    correctAnswer: 3,
  },
  {
    id: 2,
    question: "JavaScript에서 비동기 처리를 위한 키워드는?",
    options: ["async/await", "sync/defer", "wait/promise", "delay/timeout"],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "CSS에서 flexbox의 주축 정렬 속성은?",
    options: ["align-items", "justify-content", "flex-direction", "align-self"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "HTTP 상태 코드 중 성공을 나타내는 코드는?",
    options: ["404", "500", "200", "301"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "Git에서 변경사항을 저장하는 명령어는?",
    options: ["git push", "git commit", "git pull", "git merge"],
    correctAnswer: 1,
  }
]

export const GAME_STATES = {
  READY: 'ready',
  PLAYING: 'playing',
  RESULT: 'result',
  GAME_OVER: 'game_over'
}

const TIME_PER_QUESTION = 10
const GRID_SIZE = 8
const NUM_AI_PLAYERS = 5
const AREA_GRID_CENTERS = [
  { x: 1, y: 1 },
  { x: 5, y: 1 },
  { x: 1, y: 5 },
  { x: 5, y: 5 },
]

const NICKNAMES = [
  '꿈꾸는 구랩',
  '희망찬 로봇',
  '전설의 로봇',
  '신비로운 로봇',
  '찬란한 로봇',
  '센치한 로봇'
]

const getRandomSpawnPosition = () => {
  const x = Math.floor(Math.random() * GRID_SIZE)
  const y = Math.floor(Math.random() * GRID_SIZE)
  return { x, y }
}

const getRandomMoveInterval = () => {
  return 500 + Math.random() * 1000
}

const generateAIPlayers = () => {
  return Array.from({ length: NUM_AI_PLAYERS }, (_, i) => ({
    id: `ai-${i}`,
    name: NICKNAMES[i + 1], // AI players get nicknames 1-4
    gridPosition: getRandomSpawnPosition(),
    isAlive: true,
    color: ['#FFD3E0', '#A8E6CF', '#E0BBE4', '#FFDAB9', '#D4E4F7'][i],
    nextMoveTime: Date.now() + getRandomMoveInterval()
  }))
}

const gridToPercent = (gridX, gridY) => {
  const x = (gridX / (GRID_SIZE - 1)) * 100
  const y = (gridY / (GRID_SIZE - 1)) * 100
  return { x, y }
}

const getAreaFromGrid = (gridX, gridY) => {
  const midPoint = GRID_SIZE / 2
  if (gridY < midPoint) {
    return gridX < midPoint ? 0 : 1
  } else {
    return gridX < midPoint ? 2 : 3
  }
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.READY)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [gridPosition, setGridPosition] = useState(getRandomSpawnPosition())
  const [targetGridPosition, setTargetGridPosition] = useState(null)
  const [isDead, setIsDead] = useState(false)
  const [aiPlayers, setAiPlayers] = useState(generateAIPlayers())

  const currentArea = getAreaFromGrid(gridPosition.x, gridPosition.y)
  const characterPosition = gridToPercent(gridPosition.x, gridPosition.y)
  const currentQuestion = QUESTIONS[currentQuestionIndex]

  const goToNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTimeLeft(TIME_PER_QUESTION)
      setSelectedAnswer(null)
      setIsDead(false)
      setTargetGridPosition(null)
      setAiPlayers(prev => prev.map(player => ({
        ...player,
        nextMoveTime: player.isAlive ? Date.now() + getRandomMoveInterval() : player.nextMoveTime
      })))
      setGameState(GAME_STATES.PLAYING)
      // 새 질문이 나타난 후 가시 표시 정리
      setTimeout(() => setShowCorrectAnswer(false), 100)
    } else {
      setGameState(GAME_STATES.GAME_OVER)
    }
  }

  const handleTimeUp = () => {
    const answerIndex = currentArea
    setSelectedAnswer(answerIndex)
    setShowCorrectAnswer(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer

    setAiPlayers(prev => prev.map(player => {
      if (!player.isAlive) return player
      const playerArea = getAreaFromGrid(player.gridPosition.x, player.gridPosition.y)
      const playerCorrect = playerArea === currentQuestion.correctAnswer
      return {
        ...player,
        isAlive: playerCorrect
      }
    }))

    if (isCorrect) {
      setScore(prev => prev + 100)
      setGameState(GAME_STATES.RESULT)
      setTimeout(() => goToNextQuestion(), 2000)
    } else {
      setIsDead(true)
      setGameState(GAME_STATES.RESULT)
      setTimeout(() => setGameState(GAME_STATES.GAME_OVER), 2000)
    }
  }

  const handleSubmitAnswer = () => {
    if (gameState !== GAME_STATES.PLAYING) return

    setSelectedAnswer(currentArea)
    setShowCorrectAnswer(true)

    const isCorrect = currentArea === currentQuestion.correctAnswer

    setAiPlayers(prev => prev.map(player => {
      if (!player.isAlive) return player
      const playerArea = getAreaFromGrid(player.gridPosition.x, player.gridPosition.y)
      const playerCorrect = playerArea === currentQuestion.correctAnswer
      return {
        ...player,
        isAlive: playerCorrect
      }
    }))

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10)
      setScore(prev => prev + 100 + timeBonus)
      setGameState(GAME_STATES.RESULT)
      setTimeout(() => goToNextQuestion(), 2000)
    } else {
      setIsDead(true)
      setGameState(GAME_STATES.RESULT)
      setTimeout(() => setGameState(GAME_STATES.GAME_OVER), 2000)
    }
  }

  const handleGridClick = (gridPos) => {
    if (gameState !== GAME_STATES.PLAYING) return
    setTargetGridPosition(gridPos)
  }

  const startGame = () => {
    setGameState(GAME_STATES.PLAYING)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(TIME_PER_QUESTION)
    setSelectedAnswer(null)
    setShowCorrectAnswer(false)
    setIsDead(false)
    setGridPosition(getRandomSpawnPosition())
    setTargetGridPosition(null)
    setAiPlayers(generateAIPlayers())
  }

  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) return

    if (timeLeft <= 0) {
      handleTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 0.1)
    }, 100)

    return () => clearInterval(timer)
  }, [gameState, timeLeft, handleTimeUp])

  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING || !targetGridPosition) return

    const moveInterval = setInterval(() => {
      setGridPosition(prev => {
        if (prev.x === targetGridPosition.x && prev.y === targetGridPosition.y) {
          setTargetGridPosition(null)
          return prev
        }

        let newX = prev.x
        let newY = prev.y

        // 먼저 X 좌표를 맞추고, X가 같으면 Y를 맞춤 (심플한 경로)
        if (prev.x < targetGridPosition.x) {
          newX = prev.x + 1
        } else if (prev.x > targetGridPosition.x) {
          newX = prev.x - 1
        } else if (prev.y < targetGridPosition.y) {
          newY = prev.y + 1
        } else if (prev.y > targetGridPosition.y) {
          newY = prev.y - 1
        }

        return { x: newX, y: newY }
      })
    }, 150)

    return () => clearInterval(moveInterval)
  }, [gameState, targetGridPosition])

  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) return

    const aiMoveInterval = setInterval(() => {
      const now = Date.now()

      setAiPlayers(prev => prev.map(player => {
        if (!player.isAlive) return player
        if (now < player.nextMoveTime) return player

        const directions = [
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 }
        ]

        const randomDir = directions[Math.floor(Math.random() * 4)]
        const newX = Math.max(0, Math.min(GRID_SIZE - 1, player.gridPosition.x + randomDir.dx))
        const newY = Math.max(0, Math.min(GRID_SIZE - 1, player.gridPosition.y + randomDir.dy))

        return {
          ...player,
          gridPosition: { x: newX, y: newY },
          nextMoveTime: now + getRandomMoveInterval()
        }
      }))
    }, 100)

    return () => clearInterval(aiMoveInterval)
  }, [gameState])

  useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setGridPosition(prev => prev.y > 0 ? { ...prev, y: prev.y - 1 } : prev)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setGridPosition(prev => prev.y < GRID_SIZE - 1 ? { ...prev, y: prev.y + 1 } : prev)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setGridPosition(prev => prev.x > 0 ? { ...prev, x: prev.x - 1 } : prev)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setGridPosition(prev => prev.x < GRID_SIZE - 1 ? { ...prev, x: prev.x + 1 } : prev)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmitAnswer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, handleSubmitAnswer])

  if (gameState === GAME_STATES.READY) {
    return (
      <div className="app">
        <div className="start-screen">
          <h2 className="game-title">🎮 3D 스피드 퀴즈 디자인 데모</h2>
          <p className="game-description">
            3D 캐릭터를 움직여서<br/>
            정답 영역으로 가세요!
          </p>
          <div className="game-info">
            <div className="info-item">
              <div className="info-label">문제 수</div>
              <div className="info-value">{QUESTIONS.length}개</div>
            </div>
            <div className="info-item">
              <div className="info-label">제한 시간</div>
              <div className="info-value">{TIME_PER_QUESTION}초/문제</div>
            </div>
          </div>
          <div className="game-instructions">
            <p>⌨️ 방향키(↑↓←→)로 3D 캐릭터 이동</p>
            <p>🖱️ 영역 클릭으로 빠른 이동 가능</p>
          </div>
          <button className="start-button" onClick={startGame}>
            게임 시작
          </button>
        </div>
      </div>
    )
  }

  if (gameState === GAME_STATES.GAME_OVER) {
    const isGameOverByWrongAnswer = isDead
    const completedQuestions = isGameOverByWrongAnswer ? currentQuestionIndex : QUESTIONS.length
    const survivorsCount = aiPlayers.filter(p => p.isAlive).length + (!isDead ? 1 : 0)
    const totalPlayers = NUM_AI_PLAYERS + 1

    return (
      <div className="app">
        <div className="game-over-screen">
          <h1 className="game-over-title">
            {isGameOverByWrongAnswer ? '💀 Game Over!' : '🎉 게임 종료!'}
          </h1>
          {isGameOverByWrongAnswer && (
            <p className="game-over-message">가시에 찔렸습니다!</p>
          )}
          {!isGameOverByWrongAnswer && (
            <p className="game-over-message" style={{color: '#2ed573'}}>축하합니다! 모든 문제를 해결했습니다!</p>
          )}
          <div className="final-score">
            <div className="score-label">최종 점수</div>
            <div className="score-value">{score}</div>
          </div>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">푼 문제</span>
              <span className="stat-value">
                {completedQuestions} / {QUESTIONS.length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">생존자</span>
              <span className="stat-value">
                {survivorsCount} / {totalPlayers}
              </span>
            </div>
          </div>
          <button className="restart-button" onClick={startGame}>
            다시 시작
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app app-3d-fullscreen">
      <div className="game-canvas-container">
        {/* Layer 1: 2D 바닥 (z-index: 1) */}
        <GameBoard2D
          currentArea={currentArea}
          showCorrectAnswer={showCorrectAnswer}
          correctAnswer={currentQuestion.correctAnswer}
          onGridClick={handleGridClick}
          options={currentQuestion.options}
        />

        {/* Layer 2: 3D 캐릭터 (z-index: 5) */}
        <GameScene3D
          gridPosition={gridPosition}
          isDead={isDead}
          aiPlayers={aiPlayers}
          playerName={NICKNAMES[0]}
          gameState={gameState}
          showCorrectAnswer={showCorrectAnswer}
          correctAnswer={currentQuestion.correctAnswer}
        />

        {/* Layer 4: UI 오버레이 (z-index: 50) */}
        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.RESULT) && (
          <>
            {/* Question Text */}
            <div className="quiz-question">
              {currentQuestion.question}
            </div>

            {/* Top Left - Question Progress */}
            <div className="quiz-info quiz-info-left">
              <div className="quiz-label">문제</div>
              <div className="quiz-value">{currentQuestionIndex + 1}/{QUESTIONS.length}</div>
              <div className="quiz-label" style={{ marginTop: '0.5rem' }}>점수</div>
              <div className="quiz-score">{score}</div>
            </div>

            {/* Top Right - Time */}
            {gameState === GAME_STATES.PLAYING && (
              <div className="quiz-info quiz-info-right">
                <div className="quiz-time" style={{ color: timeLeft < 3 ? '#ff4757' : '#58CC02' }}>
                  {Math.ceil(timeLeft)}s
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {gameState === GAME_STATES.PLAYING && (
        <div className="submit-container">
          <button
            className="submit-button"
            onClick={handleSubmitAnswer}
          >
            정답 제출 ({currentArea + 1}번) - Enter
          </button>
        </div>
      )}
    </div>
  )
}

export default App
