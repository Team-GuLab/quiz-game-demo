import './GameBoard2D.css'

const GameBoard2D = ({ currentArea, showCorrectAnswer, correctAnswer, onAreaClick, options }) => {
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
            onClick={() => onAreaClick && onAreaClick(area.index)}
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
