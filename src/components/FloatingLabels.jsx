import './FloatingLabels.css'

const FloatingLabels = ({ options, showCorrectAnswer, correctAnswer }) => {
  // 각 영역의 위치 (보드 기준 상대 위치)
  const positions = [
    { top: '25%', left: '25%' },   // 영역 1 (좌상단)
    { top: '25%', left: '75%' },   // 영역 2 (우상단)
    { top: '75%', left: '25%' },   // 영역 3 (좌하단)
    { top: '75%', left: '75%' },   // 영역 4 (우하단)
  ]

  const getLabelStyle = (index) => {
    if (showCorrectAnswer) {
      if (index === correctAnswer) {
        return 'label-correct'
      }
      return 'label-wrong'
    }
    return ''
  }

  return (
    <div className="floating-labels-container">
      {options.map((option, index) => (
        <div
          key={index}
          className={`floating-label ${getLabelStyle(index)}`}
          style={{
            top: positions[index].top,
            left: positions[index].left,
          }}
        >
          <span className="label-number">{index + 1}</span>
          <span className="label-text">{option}</span>
        </div>
      ))}
    </div>
  )
}

export default FloatingLabels
