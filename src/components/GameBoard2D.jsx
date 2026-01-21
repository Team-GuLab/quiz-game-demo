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

  // 클릭 위치를 8x8 그리드 좌표로 변환
  const handleBoardClick = (e, areaIndex) => {
    if (!onGridClick) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // 영역 내부 상대 좌표 (0-1 범위)
    const relativeX = clickX / rect.width
    const relativeY = clickY / rect.height

    // 8x8 그리드로 변환
    // 각 영역은 4x4 그리드를 차지
    let gridX, gridY

    if (areaIndex === 0) { // 좌상단
      gridX = Math.floor(relativeX * 4)
      gridY = Math.floor(relativeY * 4)
    } else if (areaIndex === 1) { // 우상단
      gridX = 4 + Math.floor(relativeX * 4)
      gridY = Math.floor(relativeY * 4)
    } else if (areaIndex === 2) { // 좌하단
      gridX = Math.floor(relativeX * 4)
      gridY = 4 + Math.floor(relativeY * 4)
    } else { // 우하단 (areaIndex === 3)
      gridX = 4 + Math.floor(relativeX * 4)
      gridY = 4 + Math.floor(relativeY * 4)
    }

    // 범위 체크
    gridX = Math.max(0, Math.min(GRID_SIZE - 1, gridX))
    gridY = Math.max(0, Math.min(GRID_SIZE - 1, gridY))

    onGridClick({ x: gridX, y: gridY })
  }

  const areas = [
    { index: 0, label: '1' },
    { index: 1, label: '2' },
    { index: 2, label: '3' },
    { index: 3, label: '4' },
  ]

  // 원래 FloatingLabels 위치
  const optionPositions = [
    { top: '25%', left: '25%' },   // 영역 1 (좌상단)
    { top: '25%', left: '75%' },   // 영역 2 (우상단)
    { top: '75%', left: '25%' },   // 영역 3 (좌하단)
    { top: '75%', left: '75%' },   // 영역 4 (우하단)
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
