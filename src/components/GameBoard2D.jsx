import './GameBoard2D.css'

const GRID_SIZE = 8

const GameBoard2D = ({ currentArea, showCorrectAnswer, correctAnswer, onGridClick, options }) => {
  const getAreaColor = (index) => {
    const colors = ['#A8E6CF', '#FFD3E0', '#FFD3E0', '#A8E6CF']

    if (showCorrectAnswer) {
      if (index === correctAnswer) return '#58CC02'
      return '#E5E5E5'
    }

    if (index === currentArea) return '#FFE66D'

    return colors[index]
  }

  const getOptionStyle = (index) => {
    if (showCorrectAnswer) {
      if (index === correctAnswer) return 'option-correct'
      return 'option-wrong'
    }
    return ''
  }

  // 영역 내 랜덤 그리드 좌표 생성
  const getRandomPosInArea = (areaIndex) => {
    // 영역별 그리드 범위 설정 (각 영역은 4x4 그리드)
    const minX = areaIndex === 1 || areaIndex === 3 ? 4 : 0  // 우측 영역: 4-7, 좌측 영역: 0-3
    const minY = areaIndex === 2 || areaIndex === 3 ? 4 : 0  // 하단 영역: 4-7, 상단 영역: 0-3

    // 영역 내 랜덤 위치 생성
    const gridX = minX + Math.floor(Math.random() * 4)
    const gridY = minY + Math.floor(Math.random() * 4)

    return { x: gridX, y: gridY }
  }

  // 영역 클릭 시 랜덤 위치로 이동
  const handleBoardClick = (e, areaIndex) => {
    if (!onGridClick) return

    const randomPos = getRandomPosInArea(areaIndex)
    onGridClick(randomPos)
  }

  const areas = [
    { index: 0, label: '1' },
    { index: 1, label: '2' },
    { index: 2, label: '3' },
    { index: 3, label: '4' },
  ]

  // 옵션 레이블 위치 - 각 영역 내부 중앙 근처에 배치
  const optionPositions = [
    { top: '40%', left: '25%' },   // 영역 1 (좌상단)
    { top: '40%', left: '75%' },   // 영역 2 (우상단)
    { top: '60%', left: '25%' },   // 영역 3 (좌하단)
    { top: '60%', left: '75%' },   // 영역 4 (우하단)
  ]

  return (
    <>
      <div className="game-board-2d">
        {areas.map((area) => (
          <div
            key={area.index}
            className={`board-area ${currentArea === area.index ? 'active' : ''}`}
            style={{ backgroundColor: getAreaColor(area.index) }}
            onClick={(e) => handleBoardClick(e, area.index)}
          >
            <span className="area-number">{area.label}</span>
          </div>
        ))}
      </div>

      {/* 옵션 레이블 - 원래 위치에 고정 */}
      <div className="options-overlay">
        {options && options.map((option, index) => (
          <div
            key={index}
            className={`area-option ${getOptionStyle(index)}`}
            style={{
              top: optionPositions[index].top,
              left: optionPositions[index].left,
            }}
          >
            <span className="option-number">{index + 1}</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default GameBoard2D
