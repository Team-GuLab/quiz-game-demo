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

  return (
    <div className="game-board-2d">
      {areas.map((area) => (
        <div
          key={area.index}
          className={`board-area ${currentArea === area.index ? 'active' : ''}`}
          style={{ backgroundColor: getAreaColor(area.index) }}
          onClick={() => onAreaClick && onAreaClick(area.index)}
        >
          <span className="area-number">{area.label}</span>
          {options && options[area.index] && (
            <div className={`area-option ${getOptionStyle(area.index)}`}>
              <span className="option-number">{area.index + 1}</span>
              <span className="option-text">{options[area.index]}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default GameBoard2D
