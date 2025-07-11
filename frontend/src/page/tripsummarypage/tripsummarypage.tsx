import './tripsummarypage.css'
import Navbar from '../../navbar/navbar'

const TripSummaryPage = () => {
  return (
    <div className="trip-summary-page-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="trip-summary-page-content">
        <h2 className="trip-summary-title">สรุปแผนการเดินทาง</h2>
        <div className="trip-summary-subtitle">รายละเอียดการเดินทางและกิจกรรมทั้งหมด</div>
        <div className="trip-summary-card">
          <div className="trip-summary-head">
            <h3>สรุปแผนการเดินทาง สยามสแควร</h3>
            <p>3 วัน -- 3000บาท -- ชิวๆ</p>
            </div>
          <div className="trip-summary-table"></div>
        </div>
      </div>
    </div>
  )
}

export default TripSummaryPage